'use strict'
String.prototype.clr = function (hexColor){ return `<font color='#${hexColor}'>${this}</font>` };

module.exports = function EpInfo(mod){
    let xp = [],
    startTime,
    playerExp,
	playerEPOld;

    mod.hook('S_RP_SKILL_POLISHING_EXP_INFO', 1, (event) => {
        if(!mod.settings.enabled) return;
        
        playerExp = event;
        xp.push({currentEP: Number(event.epExpTotal), epLevelLow: Number(event.epLevelLow), time: Date.now()});
        if(mod.settings.showMessage){
            mod.command.message("EP/Hour: " + formatXp(xpPerHour()).toString().clr("00FFFF"));
        }
    })

   function getTotalXp(){
        let epStart = 0;
        let epEnd = 0;
		let epLevelsGained = 0;
		let epLowCurrent = 0;
		if(xp.length == 1 && playerEPOld){
			epStart = playerEPOld.currentEP;
			epEnd = xp[xp.length-1].currentEP;
			epLowCurrent = playerEPOld.epLevelLow;
			xp.forEach(function(p){
				if(p.epLevelLow!=epLowCurrent){ 
					epLevelsGained++; 
					epLowCurrent=p.epLevelLow; 
				} 
			});
		} else if(xp.length){
			epStart = xp[0].currentEP;
			epEnd = xp[xp.length-1].currentEP;
			epLowCurrent = xp[0].epLevelLow;
			xp.forEach(function(p){
				if(p.epLevelLow!=epLowCurrent){ 
					epLevelsGained++; 
					epLowCurrent=p.epLevelLow; 
				} 
			});
		}

        return {epGained: Number(epEnd-epStart), epLevelsGained: epLevelsGained};
    }
    
    function getXpPastHour(){
        let epPastHour = xp.filter(p => p.time - (Date.now() - 3600000) > 0);
        let epStart = 0;
        let epEnd = 0;
		let epLevelsGained = 0;
		let epLowCurrent = 0;
		if(xp.length == 1 && playerEPOld){
			epStart = playerEPOld.currentEP;
			epEnd = xp[xp.length-1].currentEP;
			epLowCurrent = playerEPOld.epLevelLow;
			xp.forEach(function(p){
				if(p.epLevelLow!=epLowCurrent){ 
					epLevelsGained++; 
					epLowCurrent=p.epLevelLow; 
				} 
			});
		} else if(epPastHour.length){
			epStart = epPastHour[0].currentEP;
			epEnd = epPastHour[epPastHour.length-1].currentEP;
			epLowCurrent = epPastHour[0].epLevelLow;
			epPastHour.forEach(function(p){
				if(p.epLevelLow!=epLowCurrent){ 
					epLevelsGained++; 
					epLowCurrent=p.epLevelLow; 
				} 
			});
		}

        return {epGained: Number(epEnd-epStart), epLevelsGained: epLevelsGained};
    }
 
    function xpPerHour(){
		let timePassed = Date.now() - startTime;
		return getXpPastHour().epGained * 3600000 / (timePassed < 3600000 ? timePassed : 3600000);
    }
    
    function resetMod(){
        playerEPOld = xp.pop();
        xp = [];
        startTime = Date.now();
        playerExp = null;
    }
    
	mod.game.on('enter_game', () => {
        resetMod();
	})
    
    mod.command.add(['epi', 'epinfo'], (arg) => {
        if(arg) arg = arg.toLowerCase();
        switch(arg){
            case "r":
            case "res":
            case "reset":
            case "restart":
                resetMod();
                mod.command.message(("Resetted").clr('56B4E9'));
                return;
            case "on":
            case "enable":
                mod.settings.enabled = true;
                mod.command.message("Enabled".clr('56B4E9'));
                return;
            case "off":
            case "disable":
                mod.settings.enabled = false;
                mod.command.message("Disabled".clr('E69F00'));
                return;
			case "sm":
			case "showmessage":
				mod.settings.showMessage = !mod.settings.showMessage;
				if(mod.settings.showMessage) mod.command.message("Show Message Enabled".clr('56B4E9'));
				else mod.command.message("Show Message Disabled".clr('E69F00'));
				return;
			case "su":
			case "shortunits":
				mod.settings.shortUnits = !mod.settings.shortUnits;
				if(mod.settings.shortUnits) mod.command.message("Short Units Enabled".clr('56B4E9'));
				else mod.command.message("Short Units Disabled".clr('E69F00'));
				return;
			case "cs":
			case "commaseparators":
				mod.settings.commaSeparators = !mod.settings.commaSeparators;
				if(mod.settings.commaSeparators) mod.command.message("Comma Separators Enabled".clr('56B4E9'));
				else mod.command.message("Comma Separators Disabled".clr('E69F00'));
				return;
        }
        
        mod.command.message("EP/Hour: ".clr("FDD017") + formatXp(xpPerHour()).toString().clr("00FFFF"));
        mod.command.message("EP gained: ".clr("FDD017") + formatXp(getTotalXp().epGained).clr("00FFFF"));
        mod.command.message("EP levels gained: ".clr("FDD017") + getTotalXp().epLevelsGained.toString().clr("00FFFF"));
        
        if(startTime - (Date.now() - 3600000) < 0){
            mod.command.message("Total Avg: ".clr("FDD017") + formatXp(getTotalXp().epGained / ((Date.now() - startTime) / 3600000)).clr("00FFFF"));
            mod.command.message("Total levels: ".clr("FDD017") + getTotalXp().epLevelsGained.toString().clr("00FFFF"));
        }
        mod.command.message("Session playtime: ".clr("FDD017") + msToTime(Date.now() - startTime).clr("56B4E9"));     
        if(playerExp){
            let remainingXp = Number(playerExp.epLevelUp - playerExp.epExpTotal);
            mod.command.message("Remaining EP: ".clr("FDD017") + formatXp(remainingXp).clr("00FFFF"));
            mod.command.message("ETA until Level: ".clr("FDD017") + msToTime(remainingXp / xpPerHour() * 3600000).clr("56B4E9"));
        }
    });
    
    function formatXp(xpValue){
        let format;
        
        if(mod.settings.shortUnits){
            if(xpValue >= 1000000000){
                format = xpValue * 0.000000001;
            } else if(xpValue >= 1000000){
                format = xpValue * 0.000001;             
            } else if(xpValue >= 1000){                
                format = xpValue * 0.001;
            } else{
                format = xpValue.toFixed();           
            }            
        } else{
            format = xpValue.toFixed();
        }
        
        if(mod.settings.commaSeparators) format = format.toLocaleString('en');        

        if(mod.settings.shortUnits){
            if(xpValue >= 1000000000){
                format += "B";
            } else if(xpValue >= 1000000){
                format += "M";             
            } else if(xpValue >= 1000){                
                format += "K";
            }           
        }
        
        if(playerExp) format += " (" + (xpValue / Number(playerExp.epLevelUp - playerExp.epLevelLow) * 100).toFixed(2) + "%)";
        
        return format;
    }
    
    function msToTime(duration){
        var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)));

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + "h:" + minutes + "m:" + seconds + "s";
    }    
    
}
