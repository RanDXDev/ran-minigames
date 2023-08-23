local pnis


function MemoryCard(time)
    pnis = promise.new()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "open-memory-game",
        data = {
            value = true,
            timer = time
        }
    })
    return Citizen.Await(pnis)
end

exports("MemoryCard", MemoryCard)

RegisterNUICallback("memory-game", function(data, cb)
    SetNuiFocus(false, false)
    cb(0)
    pnis:resolve(data)
end)

RegisterNUICallback("memory-exit", function(data, cb)
    SetNuiFocus(false, false)
    cb(0)
    pnis:resolve(data)
end)

RegisterCommand("memory-game", function()
    local s = exports['ran-minigames']:MemoryCard()
    print(s)
end, false)
