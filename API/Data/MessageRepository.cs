using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDto>> GetMessageForMember(MessageParams messageParams)
    {
        var query = context.Messages
        .OrderByDescending(x => x.MessageSent)
        .AsQueryable();
        query = messageParams.Container switch
        {
            "Outbox" => query.Where(x => x.SenderId == messageParams.MemberId && x.SenderDeleted==false),
            _ => query.Where(x => x.RecipientId == messageParams.MemberId && x.RecipientDeleted==false)

        };

        var messagesQuery = query.Select(MessageExtensions.ToDtoProjection());

        return await PaginationHelper.CreateAsync(messagesQuery, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipentId)
    {
        await context.Messages
        .Where(x => x.RecipientId == currentMemberId && x.SenderId == recipentId && x.DateRead == null)
        .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.DateRead, DateTime.UtcNow));

        return await context.Messages
        .Where(x => (x.RecipientId == currentMemberId && x.RecipientDeleted==false && x.SenderId == recipentId)
        || (x.SenderId == currentMemberId && x.SenderDeleted==false && x.RecipientId == recipentId))
        .OrderBy(x => x.MessageSent)
        .Select(MessageExtensions.ToDtoProjection())
        .ToListAsync();
        
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
