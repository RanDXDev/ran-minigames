local pnis
local function OpenTerminal()
    pnis = promise.new()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "open-terminal",
        data = {
            value = true
        }
    })
    return Citizen.Await(pnis)
end

exports("OpenTerminal", OpenTerminal)

RegisterNUICallback("exit-terminal", function(_, cb)
    cb(0)
    SetNuiFocus(false, false)
    pnis:resolve(false)
end)

RegisterNUICallback("terminal-done", function(_, cb)
    cb(0)
    SetNuiFocus(false, false)
    pnis:resolve(true)
end)
