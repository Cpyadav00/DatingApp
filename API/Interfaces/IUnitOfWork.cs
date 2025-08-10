using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRepository MemberRepository { get; }
    IMessageRepository MessageRepository { get; }
    ILikeRepository LikeRepository { get; }

    Task<bool> Complete();
    bool HasChanges();

}
