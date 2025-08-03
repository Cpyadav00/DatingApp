using System;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(ILikeRepository likeRepository) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();
        if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");
        var existingLike = await likeRepository.GetMemberLike(sourceMemberId, targetMemberId);
        if (existingLike == null)
        {
            var memberLike = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            };
            likeRepository.AddLike(memberLike);
        }
        else
        {
            likeRepository.DeleteLike(existingLike);
        }
        if (await likeRepository.SaveAllChanges()) return Ok();
        return BadRequest("Failed to like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberIds()
    {
        return Ok(await likeRepository.GetCurrentMemberLikeIds(User.GetMemberId()));
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLike([FromQuery] LikesParams likesParams)
    {
        likesParams.MemberId = User.GetMemberId();
        var members = await likeRepository.GetMemberLikes(likesParams);
        return Ok(members);
    }

   
}
