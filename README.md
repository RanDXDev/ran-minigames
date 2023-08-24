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

### Support

[![](https://dcbadge.vercel.app/api/server/eGkquvxhSf)](https://discord.gg/eGkquvxhSf)

### License

<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.
