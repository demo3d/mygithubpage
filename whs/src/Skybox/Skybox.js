/**
 * © Alexander Buzin, 2014-2015
 * Site: http://alexbuzin.me/
 * Email: alexbuzin88@gmail.com
*/

WHS.Skybox = class Skybox extends WHS.Shape {

	constructor( params ) {

		super( params, "skybox" );

        api.extend(params, {

            skyType: "box",
            detail: ".png",
            radius: 10,

            path: ""

        });

        var skyGeometry, skyMat;

		switch ( params.skyType ) {
            case "box":

                var directions = [ "xpos", "xneg", "ypos", "yneg", "zpos", "zneg" ];

                skyGeometry = new THREE.CubeGeometry( params.radius, params.radius, params.radius );

                var matArray = [];

                for ( var i = 0; i < 6; i ++ ) {

                    matArray.push( new THREE.MeshBasicMaterial( {
                        map: THREE.ImageUtils.loadTexture( params.path + directions[ i ] + params.imgSuffix ),
                        side: THREE.BackSide
                    } ) );

                }

                skyMat = new THREE.MeshFaceMaterial( matArray );

                break;
            case "sphere":

                skyGeometry = new THREE.SphereGeometry( params.radius / 2, 60, 40 );

                skyMat = new THREE.MeshBasicMaterial( {
                    map: THREE.ImageUtils.loadTexture( params.path + params.imgSuffix ),
                    side: THREE.BackSide
                } );

                break;
        }

        this.mesh = new THREE.Mesh( skyGeometry, skyMat );
        this.mesh.renderDepth = 1000.0;

        super.build();

	}

}

WHS.init.prototype.Skybox = function( params ) {
	return ( new WHS.Skybox(  params ) ).addTo( this );
}
