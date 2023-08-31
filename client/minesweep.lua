local pnis

function MineSweep(money, bomb, bombfail, position)
    if not money then return end
    pnis = promise.new()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "open-minesweep",
        data = {
            value = true,
            money = money,
            bomb = bomb,
            failbomb = bombfail,
            position = position or "left"
        }
    })
    return Citizen.Await(pnis)
end

exports("MineSweep", MineSweep)

RegisterNUICallback("minesweep-cashout", function(data, cb)
    SetNuiFocus(false, false)
    cb(0)
    pnis:resolve(data)
end)

RegisterNUICallback("exit", function(data, cb)
    SetNuiFocus(false, false)
    cb(0)
    pnis:resolve(false)
end)
