"use strict";

var cubicHermite = {

    spline:function($line){
        if($line.length==undefined || $line.length<2){
            return $line;
        }

        var newLink = this.doCubicHermite($line,0.02);
        if($line.length!==undefined && newLink.length>0){
            return newLink;
        }else{
            return $line;
        }
    },

    //$line:位置点数组
    //delta:精度
    doCubicHermite:function($line,delta){
        var newLink = [];

        var lineLength = $line.length;
        var pX = 0;
        var pY = 0;
        for(var i=0;i<lineLength;i++){
            for(var t=0;t<1;t += delta){
                var h00 = (1+2*t)*(1-t)*(1-t);
                var h10 = t * (t - 1) * (t - 1);
                var h01 = t * t * (3 - 2 * t);
                var h11 = t * t * (t - 1);

                if(i==0){
                    var p0 = {
                        lat:$line[i]['lat'],
                        lng:$line[i]['lng']
                    };
                    var p1 = {
                        lat:$line[i+1]['lat'],
                        lng:$line[i+1]['lng']
                    };
                    var p2 = null;

                    if(lineLength>2){
                        p2 = {
                            lat:$line[i+2]['lat'],
                            lng:$line[i+2]['lng']
                        };
                    }else{
                        p2 = p1;
                    }

                    var m0 = this.calSplineTangent(p1,p0);
                    var m1 = this.calSplineTangent(p2,p0);

                    pX = h00 * p0['lat'] + h10 * m0['lat'] + h01 * p1['lat'] + h11 * m1['lat'];
                    pY = h00 * p0['lng'] + h10 * m0['lng'] + h01 * p1['lng'] + h11 * m1['lng'];

                    newLink.push({'lat':pX,'lng':pY});
                }else if(i < lineLength-2){
                    var p0 = {
                        lat:$line[i-1]['lat'],
                        lng:$line[i-1]['lng']
                    };
                    var p1 = {
                        lat:$line[i]['lat'],
                        lng:$line[i]['lng']
                    };
                    var p2 = {
                        lat:$line[i+1]['lat'],
                        lng:$line[i+1]['lng']
                    };
                    var p3 = {
                        lat:$line[i+2]['lat'],
                        lng:$line[i+2]['lng']
                    };

                    var m0 = this.calSplineTangent(p2,p0);
                    var m1 = this.calSplineTangent(p3,p1);

                    pX = h00 * p0['lat'] + h10 * m0['lat'] + h01 * p1['lat'] + h11 * m1['lat'];
                    pY = h00 * p0['lng'] + h10 * m0['lng'] + h01 * p1['lng'] + h11 * m1['lng'];

                    newLink.push({'lat':pX,'lng':pY});
                }else if(i=== lineLength -1){
                    if(lineLength <3 ){
                        continue;
                    }
                    var p0 = {
                        lat:$line[i-2]['lat'],
                        lng:$line[i-2]['lng']
                    };
                    var p1 = {
                        lat:$line[i-1]['lat'],
                        lng:$line[i-1]['lng']
                    };
                    var p2 = {
                        lat:$line[i]['lat'],
                        lng:$line[i]['lng']
                    };

                    var m0 = this.calSplineTangent(p2,p0);
                    var m1 = this.calSplineTangent(p3,p1);

                    pX = h00 * p0['lat'] + h10 * m0['lat'] + h01 * p1['lat'] + h11 * m1['lat'];
                    pY = h00 * p0['lng'] + h10 * m0['lng'] + h01 * p1['lng'] + h11 * m1['lng'];

                    newLink.push({'lat':pX,'lng':pY});
                }
            }
        }

        return newLink;
    },
    //计算两点曲线导数
    calSplineTangent:function($latLng1,$latLng2) {
        return {
            'lat':($latLng1['lat'] - $latLng2['lat'])/2,
            'lng':($latLng1['lng'] - $latLng2['lng'])/2
        };
    }

};
module.exports = cubicHermite;