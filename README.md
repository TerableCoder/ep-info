# ep-info
Show XP/Hour and other details

Put the "S_RP_SKILL_POLISHING_EXP_INFO.1.def" file into your tera-proxy\node_modules\tera-data\protocol\ folder.

Get the Opcodes from https://github.com/TerableCoder/Tera-NA-Opcodes

XP_Info revamped for EP https://github.com/TerableCoder/xp-info

## Commands
### `epi`
- Output EP information
### `epi [on/off]`
- Enable/disable module
### `epi [r/res/reset/restart]`
- Reset current session's progress
### `epi [sm/showmessage]`
- Toggle Show Message
### `epi [su/shortunits]`
- Toggle Short Units
### `epi [cs/commaseparators]`
- Toggle Comma Separators

## Config
```
enabled (Start module on launch)
showMessage (Show current EP/Hour when EP is gained)
shortUnits (Show EP in units. "3M" intead of "3000000")
commaSeparators ("3,000,000" instead of "3000000"
```

![Screenshot](https://i.imgur.com/zn0xOBa.png)
