from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Item(BaseModel):
    id: int
    name: str

items = []

@app.get("/api/items/", response_model=List[Item])
async def read_items():
    return items

@app.post("/api/items/", response_model=Item)
async def create_item(item: Item):
    items.append(item.dict())
    return item

@app.get("/api/items/{item_id}", response_model=Item)
async def read_item(item_id: int):
    for item in items:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")
