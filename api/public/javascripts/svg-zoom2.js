const svg = document.getElementById("svg")
svg.addEventListener("wheel", zoomPan)

if (window.PointerEvent) {
  svg.addEventListener('pointerdown', onPointerDown); // Pointer is pressed
  svg.addEventListener('pointerup', onPointerUp); // Releasing the pointer
  svg.addEventListener('pointerleave', onPointerUp); // Pointer gets out of the SVG area
  svg.addEventListener('pointermove', onPointerMove); // Pointer is moving
} else {
  // Add all mouse events listeners fallback
  svg.addEventListener('mousedown', onPointerDown); // Pressing the mouse
  svg.addEventListener('mouseup', onPointerUp); // Releasing the mouse
  svg.addEventListener('mouseleave', onPointerUp); // Mouse gets out of the SVG area
  svg.addEventListener('mousemove', onPointerMove); // Mouse is moving

  // Add all touch events listeners fallback
  svg.addEventListener('touchstart', onPointerDown); // Finger is touching the screen
  svg.addEventListener('touchend', onPointerUp); // Finger is no longer touching the screen
  svg.addEventListener('touchmove', onPointerMove); // Finger is moving
}

// 各ポインターイベントからのx,y座標を返す。
function getPointFromEvent(event) {
  let point = { x: 0, y: 0 }

  // もしタッチイベントだったら最初の指の位置を取得。
  if (event.targetTouches) {
    point.x = event.targetTouches[0].clientX;
    point.y = event.targetTouches[0].clientY;
  } else {
    point.x = event.clientX;
    point.y = event.clientY;
  }

  return point;
}

// ポインターがクリック状態かどうかの判定
let isPointerDown = false;

// クリックしたときに前の座標情報を保持
let pointerOrigin = {
  x: 0,
  y: 0
}

// クリックしたときのイベント
function onPointerDown(event) {
  isPointerDown = true;

  // クリックした時の座標を取得。
  let pointerPosition = getPointFromEvent(event);
  pointerOrigin.x = pointerPosition.x;
  pointerOrigin.y = pointerPosition.y;
}

// viewBoxのサイズを設定。(svgから取得してもいいかも)
let viewBox = {
  x: 0,
  y: 0,
  width: 500,
  height: 500
}

// 新しいviewBoxの値格納オブジェクト
let newViewBox = {
  x: 0,
  y: 0
}

// 画面の拡大縮小レート
// let ratio = 1;
let ratio = viewBox.width / svg.getBoundingClientRect().width;
window.addEventListener("resize", function () {
  ratio = viewBox.width / svg.getBoundingClientRect().width;
})

// ドラッグして動かし始めた時のイベント
function onPointerMove(event) {
  // ドラッグされているかの確認
  if (!isPointerDown) {
    return;
  }

  // ページが選択されるのを防止
  event.preventDefault();

  // 現在のポインタの座標を取得
  let pointerPosition = getPointFromEvent(event);

  // 前の座標と現在の座標から距離を計算
  newViewBox.x = viewBox.x - ((pointerPosition.x - pointerOrigin.x) * ratio);
  newViewBox.y = viewBox.y - ((pointerPosition.y - pointerOrigin.y) * ratio);

  // viewBoxに登録するためのstringを作成
  let viewBoxString = `${newViewBox.x},${newViewBox.y},${viewBox.width},${viewBox.height}`;

  // svgに新しいviewBoxを登録
  svg.setAttribute("viewBox", viewBoxString);

  // document.getElementById("").innerHTML = viewBoxString;
}

function onPointerUp() {
  // ポインターがドロップ状態
  isPointerDown = false;

  // 現在のx,y座標を記憶用オブジェクトに格納
  viewBox.x = newViewBox.x;
  viewBox.y = newViewBox.y;
}

// viewBoxの再作成
function makeViewBox(x, y, w, h) {
  svg.setAttribute("viewBox", `${x},${y},${w},${h}`)
  // 現在のx,y座標を記憶用オブジェクトに格納
  viewBox.x = x;
  viewBox.y = y;
  viewBox.width = w;
  viewBox.height = h;
}

// ズームインズームアウトの処理
function zoomPan(e) {
  console.log(svg.getAttribute("viewBox").split(','))
  let [x, y, w, h] = svg.getAttribute("viewBox").split(',').map((data) => {
    let newData = Math.floor(parseFloat(data) * 100) / 100;
    return newData;
  })
  if (e.deltaY > 0) {
    w = w * 1.01;
    h = h * 1.01;
  } else {
    w = w * 0.99;
    h = h * 0.99;
  }
  makeViewBox(x, y, w, h);
  ratio = w / parseInt(svg.getAttribute("width"));
  e.preventDefault();
}

