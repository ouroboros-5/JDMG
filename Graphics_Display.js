/* -*- coding: utf-8 -*- */
/*
 *	Copyright (c) 2020, JDMG: Javascript for Dungeon Master like Game
 *              ALL RIGHTS RESERVED.
 *
 *  This source code is based on DMJ created by Joe Shaw.
 *  (https://www.thedevteam.co.uk/Knowledge-Base/DungeonMasterJavascript)
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
    JDMG_GraphicsDisplay = function( _dun ) {
        this.dun = _dun;

        this.wall_div_name = [
            // x:-2 x:-1      x:0      x:1     x:2
            ["","Side0_1", "Front0", "Side0_2",""], //y:0
            ["","Side1_1", "Front1", "Side1_2",""], //y:-1
            ["","Side2_1", "Front2", "Side2_2",""], //y:-2
            ["","Side3_1", "Front3", "Side3_2",""]  //y:-3
        ];
        this.wall_div_name_side = [
            // x:-2     x:-1      x:0      x:1     x:2
            ["",       "Lside0", "", "Rside0",       ""], //y:0
            ["",       "Lside1", "", "Rside1",       ""], //y:-1
            ["L2side2","Lside2", "", "Rside2","R2side2"], //y:-2
            ["L2side3","Lside3", "", "Rside3","R2side3"]  //y:-3
        ];

        this.decor_img_name = [
            // x:-2 x:-1      x:0      x:1     x:2
            ["",      "",      "",        "",""], //y:0
            ["","Front1", "Front1", "Front1",""], //y:-1
            ["","Front2", "Front2", "Front2",""], //y:-2
            ["","Front2", "Front2", "Front2",""]  //y:-3
        ];
        this.decor_img_name_side = [
            // x:-2     x:-1      x:0      x:1     x:2
            ["",      "LSide0", "", "RSide0",      ""], //y:0
            ["",      "LSide1", "", "RSide1",      ""], //y:-1
            ["LSide1","LSide1", "", "RSide1","RSide1"], //y:-2
            ["LSide1","LSide1", "", "RSide1","RSide1"]  //y:-3
        ];

        //"Front0_walldecor(0,0)" is a current position used by on_stairs();
        //"wallSide3_1(-1,3)" and "wallSide3_2(1,3)" is used for stairs insted of "Lside2_walldecor(-1,2)" or "Rside2_walldecor(1,2)".
      
    }

    //Version: バージョン
    JDMG_GraphicsDisplay.prototype.get_version = function() {
        return "1.0";
    }

    //
    // Public Functions
    //
    // on the basis of DJM Script
    JDMG_GraphicsDisplay.prototype.updateViewport = function() { //ここでテストして、decorに一本化する。
        var _dun = this.dun;
        var curmap = _dun.map.get_map();
        var vx;
        var vy;

        //
        // initialize
        //
        clear_decor(this);


        for(vx=-2;vx<=2;vx++){
            for(vy=3;vy>=0;vy--){
                var vec = {};
                var _div_name = this.wall_div_name[vy][vx+2];
                _dun.calculate_vec(vx, -1*vy, _dun.get_rotation(), vec);
                if( _dun.map.is_overflow( _dun.curX + vec.x, _dun.curY + vec.y ) ){
                    if(_div_name){_dun.g_disp.disblock(".wall"+_div_name);}
                    continue;
                }
                if( vy==0 && vx==0 ){
                    continue;
                }
                if( vy<2 && (vx==2 || vx==-2) ){ //最も奥の壁
                    continue;
                }

                var _div_name_side = this.wall_div_name_side[vy][vx+2];
                if( _div_name || _div_name_side ){
                    var cell = curmap[_dun.curX + vec.x][_dun.curY + vec.y];

                    //_dun.trace("GraphicsDisplay.decore():vx="+vx+", vy="+vy+" ("+(_dun.curX + vec.x)+", "+(_dun.curY + vec.y)+"):dir="+_dun.curDir+", name="+_div_name+", name_side="+_div_name_side+", type="+cell.type+" cell="+cell );

                    //
                    // Special Type Cell
                    //
                    switch( cell.type ){
                    case 0: // aisle
                    case 2: // up
                    case 3: // down
                        if(_div_name){_dun.g_disp.hideblock(".wall"+_div_name);}
                        if(_div_name_side){_dun.g_disp.hideblock(".wall"+_div_name_side);}
                        break;
                    case 1: // wall
                        if(_div_name){_dun.g_disp.disblock(".wall"+_div_name);}
                        if(_div_name_side){_dun.g_disp.disblock(".wall"+_div_name_side);}
                        break;
                    }
                }
                //decore
                if( vx>-2 && vx<2 ){ decore(this, vx, vy, vec); }

                //door
            }
        }
        //
        // Current position decoration
        //
        var current_cell = curmap[_dun.curX][_dun.curY];
        if( current_cell ){
            if( current_cell.door ){
                on_door(this, current_cell);
            }else if(current_cell.type==2 || current_cell.type==3){
                on_stairs(this, current_cell);
            }
        }

        this.dun.g_door.updateDoor();
    }

    //
    // Stairs: up stairs(type=2), down stairs(type=3)
    //
    function doors(_this, cell, _div_name, vx, vy, vec){
        var _dun = _this.dun;
        var file;
        var front=1;
        if( vx!=0 && vy<=2 && vy>=0){
            var curmap = _dun.map.get_map();
            var cell = curmap[_dun.curX + vec.x + _dun.vx][_dun.curY + vec.y + _dun.vy];
            if( cell && cell.type==1 ){ //進行方向に壁=横からの視点
                var dvy=vy+1;
                if(vx==-1){ _div_name = '.wallSide'+(dvy)+'_1_walldecor'; file = 'doorLSide'+dvy+'.png';}
                if(vx==1 ){ _div_name = '.wallSide'+(dvy)+'_2_walldecor'; file = 'doorRSide'+dvy+'.png';}
                disblock_decor(_div_name, _dun.root_path+'/_img/'+file, {'side':vx,'dist':dvy,'front':front});
                //_dun.trace("div_name="+_div_name+", file="+file+" vx,vy="+vx+","+dvy+"("+vy+")");
            }       
        }
    }

    //
    // Stairs: up stairs(type=2), down stairs(type=3)
    //
    function stairs(_this, stairs_cell, _div_name, vx, vy, vec){
        var _dun = _this.dun;

        var dir="";
        if(stairs_cell.type==2){ //up
            dir="Stairsup";
        }else{ //down
            dir="Stairsdown";
        }

        var file;
        var front=0;
        if( vx==0 ){
            file = dir+'_Front'+vy+'.png';
            disblock_decor(_div_name, _dun.root_path+'/_img/stairs/'+file, {'side':vx,'dist':vy});
        }else if( vy==0 ){
            //file = dir+'_Side'+vy+'.png';
            _div_name = ".wall"+_this.wall_div_name[vy+1][vx+2]+"_walldecor";
            if(vx==1){
                disblock_decor(_div_name, _dun.root_path+'/_img/stairs/Side0R.png', {'side':vx,'dist':vy});
            }else if(vx==-1){
                disblock_decor(_div_name, _dun.root_path+'/_img/stairs/Side0L.png', {'side':vx,'dist':vy});
            }
        }else{ // vy>0
            var curmap = _dun.map.get_map();
            var cell = curmap[_dun.curX + (_dun.vx * vy)][_dun.curY + (_dun.vy * vy)];
            if( is_wall(cell.type) ){
                front=1;
                file = dir+'_Front'+vy+'.png';
                if(vy==3 && vx==-1){ _div_name = '.wallSide'+vy+'_1'; file = dir+'_Front'+3+'.png';}
                if(vy==3 && vx==1 ){ _div_name = '.wallSide'+vy+'_2'; file = dir+'_Front'+3+'.png';}
                if(vy==2 && vx==-1){ _div_name = '.wallSide'+vy+'_1_walldecor'; file = dir+'_Side2_1.png';front=2;}
                if(vy==2 && vx==1 ){ _div_name = '.wallSide'+vy+'_2_walldecor'; file = dir+'_Side2_2.png';front=2;}
                if(vy==1 && vx==-1){ _div_name = '.wallSide'+vy+'_1_walldecor'; file = dir+'_Side'+vy+'.png';}
                if(vy==1 && vx==1 ){ _div_name = '.wallSide'+vy+'_2_walldecor'; file = dir+'_Side'+vy+'.png';}
                disblock_decor(_div_name, _dun.root_path+'/_img/stairs/'+file, {'side':vx,'dist':vy,'front':front});
            }else{
                var around = 0;
                if(! _dun.map.is_overflow( _dun.curX + vec.x -1, _dun.curY + vec.y ) ){
                    around += curmap[_dun.curX + vec.x -1][_dun.curY + vec.y   ].type;
                }
                if(! _dun.map.is_overflow( _dun.curX + vec.x +1, _dun.curY + vec.y ) ){
                    around += curmap[_dun.curX + vec.x +1][_dun.curY + vec.y   ].type;
                }
                if(! _dun.map.is_overflow( _dun.curX + vec.x , _dun.curY + vec.y -1) ){
                    around += curmap[_dun.curX + vec.x][_dun.curY + vec.y -1].type;
                }
                if(! _dun.map.is_overflow( _dun.curX + vec.x , _dun.curY + vec.y +1) ){
                    around += curmap[_dun.curX + vec.x][_dun.curY + vec.y +1].type;
                }
                if( around>0 ){ //there is a wall or walls.
                    file = dir+'_Side'+vy+'.png';
                    _div_name = ".wall"+_this.wall_div_name_side[vy][vx+2]+"_walldecor";
                    if(vx==1 ){ file = dir+'_Side2R.png';}
                    if(vx==-1){ file = dir+'_Side2L.png';}
                    disblock_decor(_div_name, _dun.root_path+'/_img/stairs/'+file, {'side':vx,'dist':vy,'front':front});
                }
            }
        }

        _dun.trace("GraphicsDisplay:stairs():stairs_cell.type="+stairs_cell.type+"(vx="+vx+", vy="+vy+"):dir="+dir+", div="+_div_name+", file="+file+", front="+front);

    }

    function on_stairs(_this, current_cell){
        var _dun = _this.dun;

        var dir="";
        if(current_cell.type==2){ //up
            dir="Stairsup";
        }else{ //down
            dir="Stairsdown";
        }
        disblock_decor('.wallFront0_walldecor', _dun.root_path+'/_img/stairs/'+dir+'_Front0.png', {'side':0,'dist':-1});

        if( _dun.prevent_side_stepping_on_stairs ){
            _dun.html.move_ctl_box_hide("all_side");
        }else{
            _dun.html.move_ctl_box_hide("turn_mask");
        }
    }

    //
    // Door: door inner side decoration
    //
    function on_door(_this, current_cell){
        var _dun = _this.dun;
        var curmap = _dun.map.get_map();
        var front_cell = curmap[_dun.curX + _dun.vx][_dun.curY + _dun.vy];

        _dun.trace("GraphicsDisplay:on_door():(vx="+_dun.vx+", vy="+_dun.vy+"): type="+front_cell.type);

        if( is_wall(front_cell.type) ){
            disblock_decor('.wallFront0_walldecor', _dun.root_path+'/_img/doorfront0.png', {'side':0,'dist':-1});
        }
    }

    function analyze_walldecor(_dun, vx, vy, result_r){
        result_r['dir'] = new Array("","");
        result_r['front'] = new Array(0,0);
        var dir   = result_r['dir'];
        var front = result_r['front'];

        //The opposite direction of the wall surface is my direction
        //壁の面の向きの逆向きが自分の向き
        switch (_dun.curDir) {
        default:
        case 0: //N
            if( vx!=0 && vy>=2 ){dir[0]="s";front[0]=1;if(vx==1){dir[1]="w";}else{dir[1]="e";}}
            else if( vx==0 ){dir[0]="s";front[0]=1;}else{if(vx==1){dir[0]="w";}else{dir[0]="e";}} 
            break;
        case 1: //E
            if( vx!=0 && vy>=2 ){dir[0]="w";front[0]=1;if(vx==1){dir[1]="n";}else{dir[1]="s";}}
            else if( vx==0 ){dir[0]="w";front[0]=1;}else{if(vx==1){dir[0]="n";}else{dir[0]="s";}} 
            break;
        case 2: //S
            if( vx!=0 && vy>=2 ){dir[0]="n";front[0]=1;if(vx==1){dir[1]="e";}else{dir[1]="w";}}
            else if( vx==0 ){dir[0]="n";front[0]=1;}else{if(vx==1){dir[0]="e";}else{dir[0]="w";}} 
            break;
        case 3: //W
            if( vx!=0 && vy>=2 ){dir[0]="e";front[0]=1;if(vx==1){dir[1]="s";}else{dir[1]="n";}}
            else if( vx==0 ){dir[0]="e";front[0]=1;}else{if(vx==1){dir[0]="s";}else{dir[0]="n";}} 
            break;
        }
        return;
    }

    function decore(_this, vx, vy, vec){
        var _dun = _this.dun;
        var curmap = _dun.map.get_map();
        var _img_name = "wall"+_this.decor_img_name[vy][vx+2]+"_text.png";
        var _img_name_side = "wall"+_this.decor_img_name_side[vy][vx+2]+"_text.png";
        var _div_name = ".wall"+_this.wall_div_name[vy][vx+2]+"_walldecor";
        var _div_name_side = ".wall"+_this.wall_div_name_side[vy][vx+2]+"_walldecor";
        if( _div_name || _div_name_side ){
            var result_r = {};
            analyze_walldecor(_dun, vx, vy, result_r);
            var dir   = result_r['dir'];
            var front = result_r['front'];
            
            var cell = curmap[_dun.curX + vec.x][_dun.curY + vec.y];
            
            //_dun.trace("GraphicsDisplay.decore():vx="+vx+", vy="+vy+" ("+(_dun.curX + vec.x)+", "+(_dun.curY + vec.y)+"):dir="+dir[0]+", name="+_div_name+", cell="+cell+", cell[dir[0]]="+cell[dir[0]] );                    
            
            //
            // Special Type Cell
            //
            switch( cell.type ){
            case 2: // up stairs
            case 3: // down stairs
                stairs(_this, cell, _div_name, vx, vy, vec);
                return;
            }
            if(cell.door){
                doors(_this, cell, _div_name, vx, vy, vec);
                return;
            }

            for( var d=0 ; d<2 ; d++ ){ 
                if ( dir[d]  && cell[dir[d]]  && cell[dir[d]].length > 0 ) {
                    for (x in cell[dir[d]]) {
                        switch ( cell[dir[d]][x].objType) {
                        case 'wallText':
                            if( vx==0 && vy==1 ){
                                $(".wallFront1").html( cell[dir[d]][x].text );
                            }else if( vx==0 && vy>1 ){
                                disblock_decor(_div_name, _dun.root_path+'/_img/'+_img_name, {'side':vx,'dist':vy});
                            }else if( vx==1 || vx==-1 ){
                                if( vy==0 ){
                                    disblock_decor(_div_name_side, _dun.root_path+'/_img/'+_img_name_side,{'side':vx,'dist':vy});
                                }else{
                                    if( front[d] ){
                                        if( vy>=2){
                                            disblock_decor(_div_name, _dun.root_path+'/_img/'+_img_name,
                                                           {'side':vx,'dist':vy,front:1});
                                        }
                                    }else{
                                        disblock_decor(_div_name_side, _dun.root_path+'/_img/'+_img_name_side,{'side':vx,'dist':vy});
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }

    }


    // on the basis of DJM Script
    JDMG_GraphicsDisplay.prototype.doStep = function(povDir) {
        this.dun.checkEvent(povDir);
        $("div[class*='side'], div[class*='Side'], .floor, .roof").each(function(index){
                var curbck = $(this).css('background-image')
                    
                    if (curbck.indexOf('alt') == -1) {
                        $(this).css('background-image', curbck.replace('nor.', 'alt.'));
                    }
                    else {
                        $(this).css('background-image', curbck.replace('alt.', 'nor.'));
                    }
                
            });
        
    }

    // on the basis of DJM Script
    JDMG_GraphicsDisplay.prototype.clearevents = function(xclass) {
        $(xclass).unbind();
    }
    
    // on the basis of DJM Script
    JDMG_GraphicsDisplay.prototype.disblock = function(xclass) {
        $(xclass).css('display', 'block');
    }

    // on the basis of DJM Script
    JDMG_GraphicsDisplay.prototype.hideblock = function(xclass) {
        $(xclass).css('display', 'none');
    }

    function disblock_decor(xclass, img, size_r){
        $(xclass).css('background-image', 'url(' + img + ')');
        $(xclass).css('display', 'block');
        if( size_r ){
            if( size_r['side'] ){
                if( size_r['dist'] == -1 ){
                    $(xclass).css('background-size', '448px 272px');
                }else if( size_r['dist'] == 0 ){
                    $(xclass).css('background-size', '64px 272px');
                }else if( size_r['dist'] == 1 ){
                    if( size_r['front'] ){
                        $(xclass).css('background-size', '64px 222px');
                    }else{
                        $(xclass).css('background-size', '56px 222px');
                    }
                }else if( size_r['dist'] == 2 ){
                    if( size_r['front'] ){
                        $(xclass).css({'background-size':'208px 142px'}); // for stairs,text
                    //}else if( size_r['front'] == 1 ){
                    //    $(xclass).css({'background-size':'120px 142px'}); // obsolete
                    }else{
                        $(xclass).css('background-size', '28px 142px'); //unused
                    }
                }else if( size_r['dist'] == 3 ){
                    $(xclass).css('background-size', '148px 102px');
                }
            }else{
                if( size_r['dist'] == 1 ){
                    $(xclass).css('background-size', '320px 222px');
                }else if( size_r['dist'] == 2 ){
                    $(xclass).css('background-size', '208px 142px');
                }else if( size_r['dist'] == 3 ){
                    $(xclass).css('background-size', '152px 102px');
                }
            }
        }
    }

    // on the basis of DJM Script
    function clear_decor(_this){
        $('.wallFront1').html('');
        $('.wallFront1').css('background-image', '');
        $('.wallSide3_1').css('background-image', '');
        $('.wallSide3_2').css('background-image', '');
        $('div[class*=decor]').css('background-image', '');
        $('div[class*=decor]').css('display', 'none');
        $('div[class*=door]').css('display', 'none');
        _this.clearevents('.doorFront1_button');
        _this.clearevents('.doorFront2_button');
        _this.clearevents('.doorSide2_1_button');

        _this.dun.html.move_ctl_box_show("all_side")
    }

    function wallDecor(){

    }

    // on the basis of DJM Script
    JDMG_GraphicsDisplay.prototype.tmpLightswitch = function() {
        this.dun.trace("JDMG_GraphicsDisplay.tmpLightswitch().");

        var _id = '#'+this.dun.html.get_overlay_div_id();
        if ($(_id).css('display') == 'block') {
            $(_id).css('display', 'none');
        } else {
            $(_id).css('display', 'block');
        }
    }

    JDMG_GraphicsDisplay.prototype.Set_LightLevel = function(_light) {
        // _light:
        //   0:week --- 5:strong
        //
        var _id = '#'+this.dun.html.get_overlay_div_id();
        if( _light > 10 ){
            $(_id).css('opacity', 0);
            $(_id).css('display', 'none');
        }else{
            $(_id).css('display', 'block');
            if( _light > 1 ){
                $(_id).css('opacity', (1-(_light/10)));
            }else{
                $(_id).css('opacity', 1);
            }
        }
        this.dun.trace("JDMG_GraphicsDisplay.Set_LightLevel("+_light+") -> opacity:"+(1-(_light/10)));
    }

    //
    // Private Functions
    //
    function is_wall(type){
        if( type == 1 ){ return 1; } //XXXXXXXXXXXXX
        return 0;
    }
    
}(window));
