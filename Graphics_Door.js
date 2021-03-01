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
    // Constructor: コンストラクタ
    //
    //
    JDMG_Graphics_Door = function(_dun) {
        this.dun = _dun;

        this.door_div_name = [
            // x:-1      x:0      x:1
            ["Side1_1","Front1","Side1_2"], //y:-1
            ["Side2_1","Front2","Side2_2"], //y:-2
            ["Side3_1","Front3","Side3_2"]  //y:-3
        ];
    }

    //Version: バージョン
    JDMG_Graphics_Door.prototype.get_version = function() {
        return "1.0";
    }

    //
    // Public Functions
    //
    JDMG_Graphics_Door.prototype.updateDoor = function() {
        //this.dun.trace("JDMG_Graphics_Door.updateDoor() dir="+this.dun.curDir);

        clear_door(this);
        door(this);
    }

    //
    // Private Functions
    //
    function door(_this){
        var _dun = _this.dun;
        var curmap = _dun.map.get_map();
        var vx;
        var vy;
        for(vx=-1;vx<=1;vx++){
            for(vy=3;vy>0;vy--){
                var vec = {};
                _dun.calculate_vec(vx, -1*vy, _dun.get_rotation(), vec);
                if( _dun.map.is_overflow( _dun.curX + vec.x, _dun.curY + vec.y ) ){
                    continue;
                }
                var front = curmap[_dun.curX + vec.x][_dun.curY + vec.y];
                var door  = front.door;
                if ( door ) {
                    var door_image="";
                    switch( door.state ){
                    case 0: if ( door.innerGraphic  != null ) { door_image = door.innerGraphic;  } break;
                    case 1: if ( door.innerGraphic2 != null ) { door_image = door.innerGraphic2; } break; //Dented
                    case 2: if ( door.innerGraphic3 != null ) { door_image = door.innerGraphic3; } break; //Broken
                    }
                    var cell = curmap[_dun.curX + vec.x + _dun.vx][_dun.curY + vec.y + _dun.vy];
                    if( cell && cell.type!=1 ){ //進行方向に壁がない=正面
                        if(vy==1){
                            $('.door'+_this.door_div_name[vy-1][vx+1]+'_inner').css({'background-size':'182px 166px','background-image':door_image});
                        }else if(vy==2){
                            $('.door'+_this.door_div_name[vy-1][vx+1]+'_inner').css({'background-size':'122px 111px','background-image':door_image});
                        }else if(vy==3){
                            $('.door'+_this.door_div_name[vy-1][vx+1]+'_inner').css({'background-size':'95px 85px','background-image':door_image});
                        }else{
                            _dun.trace("Graphic_Door:door().Invalid vy="+vy+".");
                        }
                        _dun.g_disp.disblock('.door'+_this.door_div_name[vy-1][vx+1]+'');
                        _dun.g_disp.disblock('.door'+_this.door_div_name[vy-1][vx+1]+'_inner');
                        _dun.g_disp.disblock('.door'+_this.door_div_name[vy-1][vx+1]+'_button');

                        if( vy==1 ){
                            $('.door'+_this.door_div_name[vy-1][vx+1]+'_inner').css('height', door.position + 'px');
                            if( vx==0 ){
                                //Right in Front Door
                                var _front_door = door; //for keep door object
                                $('.door'+_this.door_div_name[vy-1][vx+1]+'_button').click(function(){
                                        _front_door.openclose(); //_dun.curX + vec.x, _dun.curY + vec.y
                                        _dun.sound_effect(24); //Button: スイッチ音
                                    });
                            }
                        }else if(vy==2){
                            $('.door'+_this.door_div_name[vy-1][vx+1]+'_inner').css('height', Math.floor(door.position*(125/181)) + 'px');
                        }else if(vy==3){
                            $('.door'+_this.door_div_name[vy-1][vx+1]+'_inner').css('height', Math.floor(door.position*(95/181)) + 'px');
                        }
                        //break;
                    }
                }else{
                    _dun.g_disp.hideblock('.door'+_this.door_div_name[vy-1][vx+1]+'');
                    _dun.g_disp.hideblock('.door'+_this.door_div_name[vy-1][vx+1]+'_inner');
                    _dun.g_disp.hideblock('.door'+_this.door_div_name[vy-1][vx+1]+'_button');
                    _dun.g_disp.clearevents('.door'+_this.door_div_name[vy-1][vx+1]+'_button');
                }
            }
        }
    }

    // on the basis of DJM Script
    function clear_door(_this){
        var _dun = _this.dun;
        $('div[class*=door]').css('display', 'none');
        _dun.g_disp.clearevents('.doorFront1_button');
        _dun.g_disp.clearevents('.doorFront2_button');
        _dun.g_disp.clearevents('.doorSide2_1_button');
    }

}(window));
