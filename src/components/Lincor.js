import {Component} from 'whs/src/framework/core/Component';
import {Element} from 'whs/src/framework/core/Element';
import {MeshComponent} from 'whs/src/framework/core/MeshComponent';
import {Loop} from 'whs/src/framework/extras/Loop';
import * as THREE from 'whs/src/framework/three';
const TweenLite = require('gsap').TweenLite;

class Lincor extends Component {
  constructor(params = {}) {
    super(params, Lincor.defaults, Lincor.instructions);

    const geometry = new THREE.Geometry();

    geometry.vertices = [
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 2, 0)
    ];

    geometry.faces = [
      new THREE.Face3(2, 1, 0, null, null, 1),
      new THREE.Face3(0, 1, 3, null, null, 0),
      new THREE.Face3(0, 2, 3, null, null, 2),
      new THREE.Face3(1, 2, 3, null, null, 3)
    ];

    const matPars = {color: 0x000000, transparent: true, opacity: 0.9, side: THREE.DoubleSide};

    const material = new THREE.MeshBasicMaterial(matPars);

    this.native = new THREE.Mesh(geometry, material);

    super.wrap().then(() => {
      const outline = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
      );

      outline.scale.set(1.2, 1.2, 1.2);

      new Element(
        outline,
        [MeshComponent]
      ).addTo(this).then(element => {
        this.$outline = element;
      });
    });

    // this.runGlitch();
  }

  runGlitch() {
    const randomInteger = (min, max) => Math.round(Math.random() * (max - min) + min);

    let tmpMaterial;
    window.setInterval(() => {
      if (tmpMaterial) tmpMaterial.opacity = 0.9;
      const newMat = this.material.materials[randomInteger(1, 3)];
      newMat.opacity = 0;
      window.setTimeout(() => {newMat.opacity = 0.9}, randomInteger(50, 150));
      window.setTimeout(() => {newMat.opacity = 0}, randomInteger(250, 400));
      tmpMaterial = newMat;
    }, 1600);
  }

  trigger() {
    TweenLite.to(this.material.color, 1, {r: 1, g: 1, b: 1, ease: Power1.easeOut});
    TweenLite.to(this.material.color, 1, {r: 0, g: 0, b: 0, delay: 1, ease: Power1.easeIn});

    if (this.connector) {
      TweenLite.to(this.connector.material.color, 1, {r: 1, g: 1, b: 1, ease: Power1.easeOut});
      TweenLite.to(this.connector.material.color, 1, {r: 0, g: 0, b: 0, delay: 1, ease: Power1.easeIn});
    }

    if (this.$outline) {
      TweenLite.to(this.$outline.material.color, 1, {r: 0, g: 0, b: 0, ease: Power1.easeOut});
      TweenLite.to(this.$outline.material.color, 1, {r: 1, g: 1, b: 1, delay: 1, ease: Power1.easeIn});
    }
  }
} 

Lincor = MeshComponent(Lincor);

export {
  Lincor
};
