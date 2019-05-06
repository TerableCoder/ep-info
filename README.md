# sa-info
Shows SA EXP/Hour and other details

Put the "S_RP_SKILL_POLISHING_EXP_INFO.1.def" file into your tera-proxy\node_modules\tera-data\protocol\ folder.

Get the Opcodes from https://github.com/TerableCoder/Tera-NA-Opcodes

XP_Info revamped for SA https://github.com/TerableCoder/xp-info

## Commands
### `sa`
- Output SA information
### `sa [on/off]`
- Enable/disable module
### `sa [r/res/reset/restart]`
- Reset current session's progress
### `sa [sm/showmessage]`
- Toggle Show Message
### `sa [su/shortunits]`
- Toggle Short Units
### `sa [cs/commaseparators]`
- Toggle Comma Separators

## Config
```
enabled (Start module on launch)
showMessage (Show current SA/Hour when SA is gained)
shortUnits (Show SA in units. "3M" intead of "3000000")
commaSeparators ("3,000,000" instead of "3000000"
```

![Screenshot](https://i.imgur.com/iGIiexL.png)
