/**
 * © Alexander Buzin, 2014-2015
 * Site: http://alexbuzin.me/
 * Email: alexbuzin88@gmail.com
*/

WHS.Terrain = class Terrain extends WHS.Shape {

	constructor( params ) {

		super( params, "terrain" );

        api.extend(params.geometry, {

            width: 1,
            height: 1,
            depth: 1,
            map: false

        });

        var canvas = document.createElement('canvas');

        canvas.setAttribute("width", params.geometry.width);
        canvas.setAttribute("height", params.geometry.height);

        if (canvas.getContext) {

            var ctx = canvas.getContext('2d');

            ctx.drawImage(params.geometry.map, 0, 0);

        }

        // Ocean texture.
        var oceanTexture = api.TextureLoader().load(
            WHS._settings.assets + '/textures/terrain/dirt-512.jpg'
        );

        oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;

        // Sandy texture.
        var sandyTexture = api.TextureLoader().load(
            WHS._settings.assets + '/textures/terrain/sand-512.jpg'
        );

        sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping;

        // Grass texture.
        var grassTexture = api.TextureLoader().load(
            WHS._settings.assets + '/textures/terrain/grass-512.jpg'
        );

        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;

        // Rocky texture.
        var rockyTexture = api.TextureLoader().load(
            WHS._settings.assets + '/textures/terrain/rock-512.jpg'
        );

        rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;

        // Snowy texture.
        var snowyTexture = api.TextureLoader().load(
            WHS._settings.assets + '/textures/terrain/snow-512.jpg'
        );

        snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;

        // Normal Map.
        var normalShader = THREE.NormalMapShader;

        var rx = 256,
            ry = 256;

        var pars = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,

            format: THREE.RGBFormat
        };

        // Heightmap.
        var heightMap = new THREE.WebGLRenderTarget( rx, ry, pars );

        heightMap.texture = api.TextureLoader()
            .load(WHS._settings.assets + '/terrain/default_terrain.png');

        // Normalmap.
        var normalMap = new THREE.WebGLRenderTarget( rx, ry, pars );

        normalMap.texture = api.TextureLoader()
            .load(WHS._settings.assets + '/terrain/NormalMap.png');

        // Specularmap.
        var specularMap = new THREE.WebGLRenderTarget( 256, 256, pars ); //2048

        specularMap.texture = api.TextureLoader()
            .load(WHS._settings.assets + '/terrain/default_terrain.png');

        // Terrain shader (ShaderTerrain.js).
        var terrainShader = THREE.ShaderTerrain[ "terrain" ];

        var uniformsTerrain = Object.assign(

            THREE.UniformsUtils.clone( terrainShader.uniforms ),

            {
                oceanTexture:   { type: "t", value: oceanTexture },
                sandyTexture:   { type: "t", value: sandyTexture },
                grassTexture:   { type: "t", value: grassTexture },
                rockyTexture:   { type: "t", value: rockyTexture },
                snowyTexture:   { type: "t", value: snowyTexture },
                fog: true,
                lights: true
            },

            THREE.UniformsLib['common'],
            THREE.UniformsLib['fog'],
            THREE.UniformsLib['lights'],
            THREE.UniformsLib['ambient'],
            THREE.UniformsLib['shadowmap'],

            {
                    ambient  : { type: "c", value: new THREE.Color( 0xffffff ) },
                    emissive : { type: "c", value: new THREE.Color( 0x000000 ) },
                    wrapRGB  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
            }

        );

        console.log(uniformsTerrain);

        uniformsTerrain[ "tDisplacement" ].value = heightMap;
        uniformsTerrain[ "spotShadowMap" ].value = [normalMap];

        uniformsTerrain[ "uDisplacementScale" ].value = 100;
        uniformsTerrain[ "uRepeatOverlay" ].value.set( 6, 6 );

        var material = new THREE.ShaderMaterial( {

                uniforms:       uniformsTerrain,
                vertexShader:   terrainShader.vertexShader,
                fragmentShader: terrainShader.fragmentShader,
                lights:         true,
                fog:            true,
                side: THREE.DoubleSide,
                shading: THREE.SmoothShading

        } );

        var geom = new THREE.PlaneGeometry(256, 256, 255, 255);

        geom.verticesNeedUpdate = true;

        this._rot.set(Math.PI / 180 * -90, 0, 0);

        var index = 0, 
            i = 0,
            imgdata = ctx.getImageData(0, 0, 256, 256).data;

        for ( var x = 0; x <= 255; x ++ ) {
            for ( var y = 255; y >= 0; y -- ) {
                geom.vertices[index].z = imgdata[i]/255 * 100;

                i += 4;
                index++;
            }
        }

        this.mesh = new Physijs.HeightfieldMesh(
            geom,
            Physijs.createMaterial(material, 0.8, 0.1)
        );

        geom.computeVertexNormals();
        geom.computeFaceNormals();
        geom.computeTangents();

        this.mesh.updateMatrix();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        super.build("skip");

	}

}

WHS.init.prototype.Terrain = function( params ) {
	return ( new WHS.Terrain(  params ) ).addTo( this );
}
