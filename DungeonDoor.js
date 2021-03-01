/* -*- coding: utf-8 -*- */
/*
 *	Copyright (c) 2020, JDMG: Javascript for Dungeon Master like Game
 *              ALL RIGHTS RESERVED.
 *
 *  This source code is based on DMJ created by Joe Shaw.
 *  (https://www.thedevteam.co.uk/Knowledge-Base/DungeonMasterJavascript)
 *
 *  Dungeon Class:
 *
 */


(function(window) {
    //
    //
    // Constructor: コンストラクタ (called by DungeonMap)
    //
    //
    JDMG_DungeonDoor = function(_id,_dun,state,xposition,xislocked,door_image,_xnsew,_x,_y,opt_r) {
        this.dun = _dun;
        if( (! xposition) || xposition < 0 ){xposition = 0;}
        if( xposition > this.dun.map.default_door_position ){xposition = this.dun.map.default_door_position;}
        this.id = _id;
        this.state = state;
        this.position = xposition;
        this.islocked = xislocked;
        this.doortimer = null;
        this.unlockswith = null;
        this.innerGraphic = door_image;  //Door image, ドア画像
        this.innerGraphic2 = null; //Dented door image, 凹んだドア画像
        this.innerGraphic3 = null; //Broken door image, 破壊されたドア画像
        this.dir = _xnsew;
        this.x = _x;
        this.y = _y;

        //
        // set Dented and Broken images by using door_image string.
        // door_image先頭文字列を見てDented,Broken画像を設定
        //
        // XXXXX
    }

    //Version: バージョン
    JDMG_DungeonDoor.prototype.get_version = function() {
        return "1.0";
    }

    //
    // Public Functions
    //
    // on the basis of DJM Script
	JDMG_DungeonDoor.prototype.opendoor = function(x,y){
        var _dun = this.dun;
        var curmap = _dun.map.get_map();
        var _this = this;
        _this.door_count=0;
        _dun.trace("JDMG_DungeonDoor:opendoor() start.");
        
		{
			try {
				clearInterval(curmap[x][y].door.doortimer)
			} 
			catch (ex) {
				this.dun.dbg(ex);
			}
			if (curmap[x][y].door.position > 0) {
			
				curmap[x][y].door.doortimer = setInterval(function(){
                    if( ((_this.door_count++) % 3) == 1 ){
                        _dun.sound_effect(26); //Door: ドア音
                    }

					curmap[x][y].door.position = curmap[x][y].door.position - 30;
					this.dun.g_door.updateDoor();
					this.dun.dbg(curmap[x][y].door.position.toString());
					if (curmap[x][y].door.position - 30 < 0) {
					
						curmap[x][y].door.position = 0;
						this.dun.g_door.updateDoor();
						
						clearInterval(curmap[x][y].door.doortimer);
						curmap[x][y].door.doortimer = null;
					}
					
					
				}, 150)
				
			}
			
		}
	}
	
    // on the basis of DJM Script
    JDMG_DungeonDoor.prototype.closedoor = function(x,y){
        var _dun = this.dun;
        var curmap = _dun.map.get_map();
        var _this = this;
        _this.door_count=0;
        _dun.trace("JDMG_DungeonDoor:closedoor() start.");

		try {clearInterval(curmap[x][y].door.doortimer)}catch (ex){}
		if (curmap[x][y].door.position != 166){
	
			curmap[x][y].door.doortimer = setInterval(function(){
                    if( ((_this.door_count++) % 3) == 1 ){
                        _dun.sound_effect(26); //Door: ドア音
                    }

                    curmap[x][y].door.position = curmap[x][y].door.position + 30;
                    this.dun.g_door.updateDoor();
                    this.dun.dbg(curmap[x][y].door.position.toString());
                    if (curmap[x][y].door.position +30 > 166  ){
                        curmap[x][y].door.position = 166 ;
                        this.dun.g_door.updateDoor();
                        clearInterval(curmap[x][y].door.doortimer);
                        curmap[x][y].door.doortimer = null;
                    }
				},150);
		}
	}
	
    // on the basis of DJM Script
    JDMG_DungeonDoor.prototype.openclose = function (x,y){
        var _dun = this.dun;
        var curmap = _dun.map.get_map();
        if(!x || !y){
            x = this.x;
            y = this.y;
        }
        //_dun.trace("JDMG_DungeonDoor:openclose("+x+","+y+").");

		if (curmap[x][y].door.position > 0){
			curmap[x][y].door.opendoor(x,y);
		}else{
            curmap[x][y].door.closedoor(x,y);
        }
	}
	
    // on the basis of DJM Script
	JDMG_DungeonDoor.prototype.manualposition = function(x,y,pos){
        var _dun = this.dun;
        var curmap = _dun.map.get_map();
        var _this = this;
        _this.door_count=0;
        _dun.trace("JDMG_DungeonDoor:manualposition("+x+","+y+")pos="+pos+". doorposition="+curmap[x][y].door.position);

		{
			try {
				clearInterval(curmap[x][y].door.doortimer)
			} catch (ex) {
				this.dun.dbg(ex);
			}
			if (curmap[x][y].door.position > pos) {
			
				curmap[x][y].door.doortimer = setInterval(function(){
                    _dun.trace("JDMG_DungeonDoor:manualposition("+x+","+y+")pos="+pos+". (1)Intervel="+((_this.door_count++) % 3));
                    if( ((_this.door_count++) % 3) == 1 ){
                        _dun.sound_effect(26); //Door: ドア音
                    }
                        
					curmap[x][y].door.position = curmap[x][y].door.position - 30;
					this.dun.g_door.updateDoor();
					this.dun.dbg(curmap[x][y].door.position.toString());
					if (curmap[x][y].door.position - 30 < pos) {
					
						curmap[x][y].door.position = pos;
						this.dun.g_door.updateDoor();
						clearInterval(curmap[x][y].door.doortimer);
						curmap[x][y].door.doortimer = null;
					}
				}, 150)
				
			}
			if (curmap[x][y].door.position < pos){
			
				curmap[x][y].door.doortimer = setInterval(function(){
                    _dun.trace("JDMG_DungeonDoor:manualposition("+x+","+y+")pos="+pos+". (2)Intervel="+((_this.door_count++) % 3));
                    if( ((_this.door_count++) % 3) == 1 ){
                        _dun.sound_effect(26); //Door: ドア音
                    }
					curmap[x][y].door.position = curmap[x][y].door.position + 30;
					this.dun.g_door.updateDoor();
					this.dun.dbg(curmap[x][y].door.position.toString());
					if (curmap[x][y].door.position + 30 > pos) {
					
						curmap[x][y].door.position = pos;
						this.dun.g_door.updateDoor();
						clearInterval(curmap[x][y].door.doortimer);
						curmap[x][y].door.doortimer = null;
					}
				}, 150)
				
			}
		}
	}

}(window));
