import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import TWEEN from "three/addons/libs/tween.module.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

/**
 * threejsを使ったファーストビューアニメーション
 */
async function firstviewWithThreejs() {
  const firstview = document.querySelector("#firstview");
  const canvas = document.querySelector("#fv_with_threejs");

  const width = firstview.clientWidth;
  const height = firstview.clientHeight;

  // レンダラーを作成
  // --------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // シーンを作成
  // --------------------------------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbbbbbb);

  // カメラを作成
  // --------------------------------------------------
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100000);
  camera.position.set(40, 40, 40);
  // camera.lookAt(0, 20, 0);

  // 箱を作成
  // --------------------------------------------------
  const cube = (() => {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
      map: loader.load("img/material1.jpg"),
    });
    return new THREE.Mesh(geometry, material);
  })();
  cube.position.set(0, 20, 0);
  scene.add(cube);

  // 床を作成
  // --------------------------------------------------
  // const floor = (() => {
  //   const geometry = new THREE.BoxGeometry(100, 0.1, 100)
  //   const material = new THREE.MeshStandardMaterial({ color: 0x999999 })
  //   return new THREE.Mesh(geometry, material);
  // })();
  // scene.add(floor);

  // テキストを追加
  // --------------------------------------------------
  const text = await (async () => {
    const loader = new FontLoader();
    const font = await loader.loadAsync("fonts/Bebas Neue_Regular.json");
    const geometry = new TextGeometry("KOS DESIGNWORKS", {
      font,
      size: 4,
      height: 1,
    });
    geometry.center();
    const material = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.5,
      metalness: 0.5,
    });
    return new THREE.Mesh(geometry, material);
  })();
  text.position.set(0, 35, 0);
  scene.add(text);

  // 平行光源と環境光を追加
  // --------------------------------------------------
  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.intensity = 1.3; // 光の強さを倍に
  directionalLight.position.set(0, 200, 0); // ライトの方向
  scene.add(directionalLight);

  // 環境光
  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 1.3;
  ambientLight.position.set(0, 40, 0);
  scene.add(ambientLight);

  // コントロール
  // --------------------------------------------------
  const orbitControls = new OrbitControls(camera, firstview);
  orbitControls.autoRotate = true;
  orbitControls.enableDamping = true;
  // orbitControls.enableZoom = false;
  orbitControls.target = new THREE.Vector3(0, 20, 0);

  // ヘルパー
  // --------------------------------------------------
  // const axes = new THREE.AxesHelper(100);
  // scene.add(axes);

  // const lightHelper = new THREE.PointLightHelper(ambientLight);
  // scene.add(lightHelper);

  const gridHelper = new THREE.GridHelper(100, 100, 0xdddddd, 0xcccccc);
  scene.add(gridHelper);

  // アニメーション開始
  // --------------------------------------------------
  let rot = 0;

  const tick = () => {
    requestAnimationFrame(tick);

    text.rotation.y += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // カメラの制御
    // (() => {
    //   // 毎フレーム角度を0.5度ずつ足していく
    //   rot += 0.5;
    //   // ラジアンに変換する
    //   const radian = (rot * Math.PI) / 180;
    //   // 角度に応じてカメラの位置を設定
    //   camera.position.x = 60 * Math.sin(radian);
    //   camera.position.z = 60 * Math.cos(radian);
    //   // 原点方向を見つめる
    //   camera.lookAt(new THREE.Vector3(0, 20, 0));
    // })();

    orbitControls.update();
    TWEEN.update();
    renderer.render(scene, camera);
  };

  tick();
}

firstviewWithThreejs();
