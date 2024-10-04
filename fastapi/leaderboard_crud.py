# leaderboard_crud.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import Leaderboard

# Create a leaderboard entry for a user
async def create_leaderboard_entry(db: AsyncSession, user_id: int):
    new_entry = Leaderboard(user_id=user_id, total_wins=0, highest_score=0)
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    return new_entry

# Get leaderboard entries ordered by highest score
async def get_leaderboard_entries(db: AsyncSession):
    result = await db.execute(select(Leaderboard).order_by(Leaderboard.highest_score.desc()))
    return result.scalars().all()

# Update an existing leaderboard entry
async def update_leaderboard_entry(db: AsyncSession, user_id: int, total_wins: int, highest_score: int):
    result = await db.execute(select(Leaderboard).where(Leaderboard.user_id == user_id))
    entry = result.scalar_one_or_none()
    if entry:
        entry.total_wins = total_wins
        entry.highest_score = highest_score
        await db.commit()
        await db.refresh(entry)
        return entry
    else:
        raise Exception("Leaderboard entry not found for the given user ID")
