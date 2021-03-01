/* -*- coding: utf-8 -*- */
/*
 *	Copyright (c) 2020, JDMG: Javascript for Dungeon Master like Game
 *              ALL RIGHTS RESERVED.
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
    JDMG_DungeonMovement = function(_dun) {
        this.dun = _dun;
    }

    //Version: バージョン
    JDMG_DungeonMovement.prototype.get_version = function() {
        return "1.0";
    }

    //
    // Public Functions
    //
    JDMG_DungeonMovement.prototype.moveMe = function(povDir) {
        var _dun = this.dun;
        var curmap = _dun.map.get_map();
        var bx = _dun.curX;
        var by = _dun.curY;
           
        if( _dun.finished ){
            return; // do nothing
        }

        //
        // Before Moving
        //
        var current_cell = curmap[_dun.curX][_dun.curY];
        if(current_cell.type==2 || current_cell.type==3){ //up/down stairs
            if( _dun.prevent_side_stepping_on_stairs ){
                if( povDir == "d" ){ return _dun.into_stairs(current_cell); } //return to the stairs
                if( povDir != "u" ){ return; } //Only forward is possible: 前進のみ可能
            }else{
                if( povDir == "r90" || povDir == "l90" ){ return; }
            }
        }

        //
        // Moving
        //
        var moving = 0;
        switch (povDir){
        case "u": //goUp
            moving = go(this.dun, 0);
            break;
        case "r": //goRight
            moving = go(this.dun, -90);
            break;
        case "d": //goDown
            moving = go(this.dun, 180);
            break;
        case "l": //goLeft
            moving = go(this.dun, 90);
            break;
        case "r90":
            goR90(this.dun);
            break;
        case "l90":
            goL90(this.dun);
            break;
        }

        //
        // After Moving
        //
        current_cell = curmap[_dun.curX][_dun.curY];
        if(current_cell.type==2 || current_cell.type==3){ //up/down stairs
            if( povDir != "r90" && povDir != "l90" &&
                ( bx != _dun.curX || by != _dun.curY ) ){
                _dun.into_stairs(current_cell);
                return;
            }
        }


        this.dun.update(moving);
    }



    //
    // Private Functions
    //
    function goL90(_dun){
        if (_dun.curDir > 0 ) { _dun.curDir--;} else {_dun.curDir = 3;}
        _dun.update_vec();
    }

    function goR90(_dun){
        if (_dun.curDir < 3 ) { _dun.curDir++;} else {_dun.curDir = 0;}
        _dun.update_vec();
    }

    function go(_dun, _rot){
        var curmap = _dun.map.get_map();
	    var enablestep = 0;
	    var hit = 0;
        var vec = {};
        _dun.calculate_vec(_dun.vx, _dun.vy, _rot, vec);
        var vx = vec.x;
        var vy = vec.y;
        delete vec;

        if( _dun.map.is_overflow( _dun.curX + vx, _dun.curY + vy ) ){
            //outside of the map: 場外
            _dun.trace("Movement.go();Outside("+(_dun.curX + vx)+", "+(_dun.curY + vy)+")");
            hit = 1;
        }else{
            var door = curmap[_dun.curX + vx][_dun.curY + vy ].door;
            if ( door && door.position > 0 ) {
                //
                //Door is closed
                //
                _dun.trace("Movement.go();Closed door("+(_dun.curX + vx)+", "+(_dun.curY + vy)+")");
                hit = 1;
            }else{
                //Lower 1 digit: 下位１桁
                switch ( curmap[_dun.curX + vx][_dun.curY + vy].type ){
                case 1: //Wall: 壁
                    _dun.trace("Movement.go();Hit Wall("+(_dun.curX + vx)+", "+(_dun.curY + vy)+")");
                    hit = 1;
                    break;
                case 2: //up stairs
                case 3: //down stairs
                case 0: //Aisle: 通路
                    //
                    // Step forward
                    //
                    _dun.curX += vx;
                    _dun.curY += vy;
                    enablestep = 1;
                    break;
                default:
                    break;
                    //
                    // Special Cell Type
                    //
                }
            }
        }


        //
        // Event after completion of move processing: 移動処理完了後イベント
        //
        switch ( curmap[_dun.curX][_dun.curY].type ){
        default:
            break;
            //
            // Special Cell Type
            //
        case 9999:
            if( hit ){ //Hit case: 衝突ケース
            }else{
            }
            break;		
        }
        
		if (hit){
            _dun.sound_effect(27); //Hit: 衝突音
        }
		if (enablestep){
            _dun.g_disp.doStep(_dun.curDir);
        }

        return enablestep;
    }
    

}(window));
