/* -*- coding: utf-8 -*- */
/*
 *	Copyright (c) 2020, JDMG: Javascript for Dungeon Master like Game
 *              ALL RIGHTS RESERVED.
 *
 *  Graphic Class:
 *
 */

(function(window) {
    //
    //
    // Constructor: コンストラクタ
    //
    //
    JDMG_Graphics_Compass = function( _dun, _div_id ) {
        this.dun = _dun,
        this.div_id = _div_id; //'cmp'
        this.prevDir = _dun.curDir;
    }

    //Version: バージョン
    JDMG_Graphics_Compass.prototype.get_version = function() {
        return "1.0";
    }

    //
    // Public Functions
    //
    JDMG_Graphics_Compass.prototype.draw = function( _curDir ){
        if( this.prevDir == _curDir ){return;}

        switch (_curDir) {
        case 0:
            $( '#'+this.div_id+'_txt' ).html('Ｎ');
            if( this.prevDir == 3 ){
                $( '#'+this.div_id+'_arrow' ).css({'transform':'rotate(0deg)','transition':'transform .0s'});
            }else{
                $( '#'+this.div_id+'_arrow' ).css({'transform':'rotate(0deg)','transition':'transform .1s'});
            }
            break;
        case 1:
            $( '#'+this.div_id+'_txt' ).html('Ｅ');
            $( '#'+this.div_id+'_arrow' ).css({'transform':'rotate(90deg)','transition':'transform .1s'});
            break;
        case 2:
            $( '#'+this.div_id+'_txt' ).html('Ｓ');
            $( '#'+this.div_id+'_arrow' ).css({'transform':'rotate(180deg)','transition':'transform .1s'});
            break;
        case 3:
            $( '#'+this.div_id+'_txt' ).html('Ｗ');
            if( this.prevDir == 0 ){
                $( '#'+this.div_id+'_arrow' ).css({'transform':'rotate(270deg)','transition':'transform .0s'});
            }else{
                $( '#'+this.div_id+'_arrow' ).css({'transform':'rotate(270deg)','transition':'transform .1s'});
            }
            break;
        }
        this.prevDir = _curDir;
    }

}(window));
