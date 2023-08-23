## Ran Minigames

### A collection of minigame (will expand more)

#### Memory Card Minigame

```lua
---time is optional, time is in minute
--[[
    return: boolean
]]
exports['ran-minigames']:MemoryCard(time)

-- Example
local success = exports['ran-minigames']:MemoryCard(360)
if success then
    --your logic here
end
```

#### Mine Sweep Minigame

Usually use it in a robbery script like story robbery

```lua
--[[
    money, bomb, bombfail are required.
    money: number; (Maximum money amount to get)
    bomb: number; (How much bomb the minigame has)
    bombfail: number; (How much bomb limit we get to force cash out)
    position?: "left" | "right" | "center"
]]
exports['ran-minigames']:MineSweep(money, bomb, bombfail, position)

-- EXAMPLE
local success = exports['ran-minigames']:MineSweep(12000, 12, 3, "center")
-- Will return amount of money we get from minigame
print(success)
```
