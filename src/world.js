import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const smooth = (a,b,x) => THREE.MathUtils.smoothstep(x,a,b);
// One reversible authored route. The scroll conductor owns every spatial change.
export const shots = [
  { at:0, camera:[0,.7,8.5], target:[0,.15,0], cap:[1.45,.25,0], rotation:[.28,-.45,-.19], scale:1, ribbon:1, explode:0 },
  { at:.60, camera:[1.4,1.7,5.2], target:[.9,.1,0], cap:[1.1,.2,0], rotation:[.55,.65,-.3], scale:1.05, ribbon:1, explode:.12 },
  { at:1.08, camera:[-.8,.2,3.8], target:[0,0,-6], cap:[2.4,1.4,-3.5], rotation:[1,2.4,.1], scale:.55, ribbon:1.4, explode:1 },
  { at:1.65, camera:[.8,-.7,-3], target:[0,.2,-13], cap:[1.6,1.2,-9], rotation:[.7,4.5,.25], scale:.7, ribbon:1.9, explode:1 },
  { at:2.05, camera:[0,1.2,8.4], target:[0,.3,0], cap:[.7,-.1,0], rotation:[.35,5.4,-.25], scale:1.2, ribbon:1.2, explode:0 },
  { at:2.65, camera:[-1.6,2.3,6.6], target:[0,.5,0], cap:[.5,.5,0], rotation:[.1,6.7,.12], scale:1.1, ribbon:1.1, explode:0 },
  { at:3.03, camera:[0,.7,10], target:[0,0,0], cap:[-2,-.1,-.8], rotation:[.4,7.1,-.2], scale:.9, ribbon:.85, explode:0 },
  { at:4, camera:[0,.7,10], target:[0,0,0], cap:[-2,.1,-.8], rotation:[.4,7.5,-.15], scale:.9, ribbon:.7, explode:0 },
];

export function createWorld(canvas, conductor) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false, powerPreference:'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.setClearColor(0x050505);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080503,.027);
  const camera = new THREE.PerspectiveCamera(38,1,.1,100);
  const textures = new Set();
  let disposed=false, hidden=document.hidden, lost=false, mobile=false, time=0, progress=conductor.exact, lastProgress=-1, loaded=false;
  let pointerX=0,pointerY=0,px=0,py=0, quality=1.75, slowFrames=0, frameCount=0;
  const clockHistory = [];
  const look = new THREE.Vector3();
  const seedRandom = (seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; })(20261107);

  // The generated copper portal becomes moving shader material, not a video.
  const bgUniforms = { uTime:{ value:0 },uAspect:{ value:1 },uProgress:{ value:0 },uImage:{ value:null },uLoaded:{ value:0 },uPointer:{ value:new THREE.Vector2() } };
  const bgMaterial = new THREE.ShaderMaterial({
    uniforms:bgUniforms,depthTest:false,depthWrite:false,
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.999,1.0);}',
    fragmentShader:`
      varying vec2 vUv; uniform float uTime,uAspect,uProgress,uLoaded; uniform sampler2D uImage; uniform vec2 uPointer;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec2 uv=vUv; vec2 p=uv-.5; p.x*=uAspect;
        float t=uTime*.1; float travel=sin(uProgress*1.9);
        vec2 q=uv; q.x+=sin(q.y*6.+t)*.008+uPointer.x*.008; q.y+=cos(q.x*5.+t*.7)*.006;
        float imageAspect=1.5; vec2 fit=vec2(min(1.,uAspect/imageAspect),min(1.,imageAspect/uAspect));
        vec2 sampleUv=(q-.5)*fit+.5;
        float zoom=1.+sin(uProgress*1.7)*.13;
        sampleUv=(sampleUv-.5)/zoom+.5;
        vec3 image=texture2D(uImage,sampleUv).rgb;
        float energy=.45+.12*sin(t*2.+q.y*6.);
        float darken=mix(.20,.09,smoothstep(2.7,3.3,uProgress));
        vec3 color=image*energy*darken*uLoaded;
        float r=length(p-vec2(.25,0.)); float a=atan(p.y,p.x-.25);
        float stream=0.;
        for(int i=0;i<4;i++){
          float k=float(i); float wave=.58+k*.085+sin(a*2.+t+k)*.07;
          float line=abs(r-wave); float sweep=pow(max(0.,sin(a*1.5-t*2.+k)),5.);
          stream+=.0018/(line+.007)*sweep;
        }
        color+=vec3(1.,.20,.025)*stream*.10;
        float haze=exp(-length(p-vec2(.50,-.15)) * 2.8)*(.03+.015*sin(t));
        color+=vec3(.7,.15,.015)*haze;
        float grain=(hash(gl_FragCoord.xy)-.5)*.009;
        color+=grain;
        color*=1.-.30*smoothstep(.35,1.3,length(p));
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const background = new THREE.Mesh(new THREE.PlaneGeometry(2,2),bgMaterial);
  background.frustumCulled=false; background.renderOrder=-1000; scene.add(background);
  new THREE.TextureLoader().load('/assets/data-portal.png',texture => {
    if(disposed){texture.dispose();return;}
    texture.colorSpace=THREE.SRGBColorSpace; textures.add(texture); bgUniforms.uImage.value=texture; loaded=true;
  },undefined,()=>{ loaded=false; });

  scene.add(new THREE.HemisphereLight(0xc4d4ee,0x251006,1.25));
  const key=new THREE.DirectionalLight(0xf1e7db,3.6); key.position.set(-3,5,6);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff5916,8);rim.position.set(4,2,-4);scene.add(rim);
  const orangeLight=new THREE.PointLight(0xff5e0a,40,16,2);orangeLight.position.set(2,-1,3);scene.add(orangeLight);
  const lowerFill=new THREE.DirectionalLight(0x8396b0,1.6);lowerFill.position.set(-1,-3,6);scene.add(lowerFill);
  const room=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);
  const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.65;room.dispose();pmrem.dispose();

  // A real mortarboard: thickness, velvet weave, satin band, button and braided tassel.
  const weaveSize=256, weaveData=new Uint8Array(weaveSize*weaveSize*4);
  for(let y=0;y<weaveSize;y++)for(let x=0;x<weaveSize;x++){
    const n=(y*weaveSize+x)*4;const warp=Math.sin(x*Math.PI/2),weft=Math.sin(y*Math.PI/2);
    weaveData[n]=128+warp*15;weaveData[n+1]=128+weft*15;weaveData[n+2]=252;weaveData[n+3]=255;
  }
  const weave=new THREE.DataTexture(weaveData,weaveSize,weaveSize);weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.repeat.set(7,7);weave.needsUpdate=true;textures.add(weave);
  const velvet=new THREE.MeshPhysicalMaterial({ color:0x070709,roughness:.84,metalness:0,specularIntensity:.18,sheen:.4,sheenRoughness:.7,sheenColor:0x171516,normalMap:weave,normalScale:new THREE.Vector2(.17,.17),side:THREE.DoubleSide });
  const bandMaterial=new THREE.MeshPhysicalMaterial({ color:0x09090c,roughness:.72,metalness:0,specularIntensity:.25,sheen:.35,sheenColor:0x242022,normalMap:weave,normalScale:new THREE.Vector2(.12,.12),side:THREE.DoubleSide });
  const copper=new THREE.MeshStandardMaterial({ color:0xff6a19,roughness:.35,metalness:.55,emissive:0xc12b02,emissiveIntensity:.35 });
  const edgeMaterial=new THREE.MeshStandardMaterial({ color:0x5a2d16,metalness:.25,roughness:.5 });
  const cap=new THREE.Group();cap.name='graduation-mortarboard';scene.add(cap);
  const board=new THREE.Mesh(new RoundedBoxGeometry(2.7,.12,2.7,4,.045),velvet);cap.add(board);
  const lower=new THREE.Mesh(new RoundedBoxGeometry(2.68,.045,2.68,3,.02),edgeMaterial);lower.position.y=-.073;cap.add(lower);
  const band=new THREE.Mesh(new THREE.CylinderGeometry(.72,.67,.8,64,1,true),bandMaterial);band.position.y=-.48;cap.add(band);
  const bottomRim=new THREE.Mesh(new THREE.TorusGeometry(.68,.025,6,64),bandMaterial);bottomRim.rotation.x=Math.PI/2;bottomRim.position.y=-.9;cap.add(bottomRim);
  const button=new THREE.Mesh(new THREE.SphereGeometry(.09,16,12),copper);button.scale.y=.48;button.position.y=.11;cap.add(button);
  const cordPoints=[new THREE.Vector3(0,.13,0),new THREE.Vector3(.45,.14,.35),new THREE.Vector3(1.12,.13,.78),new THREE.Vector3(1.4,.03,.96),new THREE.Vector3(1.43,-.48,1.02),new THREE.Vector3(1.39,-.92,1.07)];
  const cordPath=new THREE.CatmullRomCurve3(cordPoints);
  const cord=new THREE.Mesh(new THREE.TubeGeometry(cordPath,40,.025,8,false),copper);cap.add(cord);
  const knot=new THREE.Mesh(new THREE.CylinderGeometry(.054,.075,.14,12),copper);knot.position.set(1.39,-.94,1.07);cap.add(knot);
  const tasselGroup=new THREE.Group();tasselGroup.position.set(1.39,-1.0,1.07);cap.add(tasselGroup);
  const strandGeometries=[];
  for(let i=0;i<32;i++){
    const a=i/32*Math.PI*2,r=.035+seedRandom()*.025,l=.58+seedRandom()*.18;
    const points=[];
    for(let j=0;j<=7;j++){const f=j/7;points.push(new THREE.Vector3(Math.cos(a)*r*(1+f*1.6)+Math.sin(f*4+i)*.012,-l*f,Math.sin(a)*r*(1+f)+f*f*.10));}
    strandGeometries.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),12,.007,4,false));
  }
  const mergedTassel=mergeGeometries(strandGeometries);strandGeometries.forEach(g=>g.dispose());
  tasselGroup.add(new THREE.Mesh(mergedTassel,copper));

  // Sculpted, truly spatial copper ribbons orbit the graduation object.
  function ribbonGeometry(radius,offset,width){
    const positions=[],uvs=[],indices=[],segments=220;
    for(let i=0;i<=segments;i++){
      const f=i/segments,a=f*Math.PI*2.15+offset;
      for(let side=0;side<2;side++){
        const v=side-.5,r=radius+Math.sin(a*2+offset)*.30;
        positions.push(Math.cos(a)*(r+v*width*.35),Math.sin(a)*(r+v*width*.35)*.73,Math.sin(a*2+offset)*.8+v*width);
        uvs.push(f,side);
      }
      if(i<segments){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;
  }
  const ribbonMaterial=new THREE.MeshPhysicalMaterial({ color:0xbc3a09,roughness:.3,metalness:.72,side:THREE.DoubleSide,emissive:0xff3500,emissiveIntensity:.10 });
  const ribbons=new THREE.Group();ribbons.position.set(1.1,0,-2);ribbons.rotation.set(.12,.3,-.3);scene.add(ribbons);
  ribbons.add(new THREE.Mesh(ribbonGeometry(3.1,0,.42),ribbonMaterial));
  const ribbon2=new THREE.Mesh(ribbonGeometry(3.8,1.8,.12),copper);ribbon2.rotation.y=.5;ribbons.add(ribbon2);

  // Glyph atlas is real code typography, generated once and rendered as a GPU particle field.
  const atlas=document.createElement('canvas');atlas.width=512;atlas.height=256;
  const ctx=atlas.getContext('2d');ctx.fillStyle='#fff';ctx.font='50px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
  const glyphs=['0','1','{','}','<','>','/',';','+','=','(',')','[',']','*','.'];
  glyphs.forEach((glyph,i)=>ctx.fillText(glyph,(i%8)*64+32,Math.floor(i/8)*128+64));
  const atlasTexture=new THREE.CanvasTexture(atlas);textures.add(atlasTexture);
  const count=1800, positions=new Float32Array(count*3), seeds=new Float32Array(count), glyphIndices=new Float32Array(count), sizes=new Float32Array(count);
  for(let i=0;i<count;i++){
    const a=seedRandom()*Math.PI*2,r=1.6+seedRandom()*8;
    positions[i*3]=Math.cos(a)*r;positions[i*3+1]=Math.sin(a)*r*.65;positions[i*3+2]=-seedRandom()*34;
    seeds[i]=seedRandom();glyphIndices[i]=Math.floor(seedRandom()*16);sizes[i]=.5+seedRandom();
  }
  const codeGeo=new THREE.BufferGeometry();codeGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));codeGeo.setAttribute('aSeed',new THREE.BufferAttribute(seeds,1));codeGeo.setAttribute('aGlyph',new THREE.BufferAttribute(glyphIndices,1));codeGeo.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
  const codeUniforms={ uTime:{ value:0 },uProgress:{ value:0 },uPixelRatio:{ value:1 },uAtlas:{ value:atlasTexture },uOpacity:{ value:.5 } };
  const codeMat=new THREE.ShaderMaterial({ uniforms:codeUniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`attribute float aSeed,aGlyph,aSize;uniform float uTime,uProgress,uPixelRatio;varying float vGlyph,vAlpha;void main(){
      vec3 p=position;float speed=.2+smoothstep(.7,1.4,uProgress)*1.5*(1.-smoothstep(1.8,2.2,uProgress));
      p.z=mod(p.z+uTime*speed+34.,34.)-30.;
      float a=uTime*.025+aSeed*6.28; p.x+=sin(a)*.3;p.y+=cos(a)*.2;
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      gl_PointSize=clamp((260.*aSize*uPixelRatio)/max(1.,-mv.z),2.,48.);
      vGlyph=aGlyph;vAlpha=(.12+aSeed*.5)*smoothstep(1.,5.,-mv.z)*(1.-smoothstep(20.,35.,-mv.z));
    }`,
    fragmentShader:`uniform sampler2D uAtlas;uniform float uOpacity;varying float vGlyph,vAlpha;void main(){vec2 tile=vec2(mod(vGlyph,8.),floor(vGlyph/8.));vec2 uv=(vec2(gl_PointCoord.x,1.-gl_PointCoord.y)+tile)/vec2(8.,2.);float a=texture2D(uAtlas,uv).a;if(a<.05)discard;gl_FragColor=vec4(vec3(1.,.35,.08),a*vAlpha*uOpacity);}`,
  });
  const codeField=new THREE.Points(codeGeo,codeMat);codeField.frustumCulled=false;scene.add(codeField);

  const terminalGroup=new THREE.Group();terminalGroup.name='source-code-corridor';scene.add(terminalGroup);
  const terminalCanvas=document.createElement('canvas');terminalCanvas.width=1024;terminalCanvas.height=640;
  const tc=terminalCanvas.getContext('2d');tc.fillStyle='#0c0906';tc.fillRect(0,0,1024,640);tc.strokeStyle='#8d3a1744';tc.lineWidth=2;tc.strokeRect(1,1,1022,638);
  ['#fa6e25','#ad6636','#61513e'].forEach((c,i)=>{tc.fillStyle=c;tc.beginPath();tc.arc(35+i*23,30,5,0,Math.PI*2);tc.fill();});
  tc.font='18px monospace';tc.fillStyle='#8b7963';tc.fillText('~/life/next-chapter.ts',135,37);
  const codeLines=[['// from curiosity to possibility','#806c57'],['import { dreams } from "./future";','#ed843d'],['','#ad9f88'],['class SoftwareEngineer {','#d4c7b1'],['  name = "Phuong Mai";','#d4c7b1'],['  curiosity = Infinity;','#ef9a57'],['','#d4c7b1'],['  nextChapter() {','#d4c7b1'],['    return build(dreams);','#ed843d'],['  }','#d4c7b1'],['}','#d4c7b1'],['','#d4c7b1'],['> graduation: successfully compiled.','#ff8e3a']];
  tc.font='25px monospace';codeLines.forEach(([text,color],i)=>{tc.fillStyle='#5f4d3a';tc.fillText(String(i+1).padStart(2,'0'),32,105+i*37);tc.fillStyle=color;tc.fillText(text,95,105+i*37);});
  const terminalTexture=new THREE.CanvasTexture(terminalCanvas);terminalTexture.colorSpace=THREE.SRGBColorSpace;textures.add(terminalTexture);
  const terminalMaterial=new THREE.MeshBasicMaterial({map:terminalTexture,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
  for(let i=0;i<4;i++){const panel=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.75),terminalMaterial);const side=i%2===0?-1:1;panel.position.set(side*(3.3+i*.35),.3-(i%2)*1.2,-4-i*3.5);panel.rotation.y=-side*.38;panel.rotation.z=side*.06;terminalGroup.add(panel);}

  // Spark field resolves into a second mortarboard silhouette during the compilation passage.
  const sparkCount=1800,sparkStart=new Float32Array(sparkCount*3),sparkEnd=new Float32Array(sparkCount*3),sparkSeed=new Float32Array(sparkCount);
  for(let i=0;i<sparkCount;i++){
    let x=(seedRandom()-.5)*2.7,z=(seedRandom()-.5)*2.7,y=.03;
    if(i>sparkCount*.64){const a=seedRandom()*6.28;x=Math.cos(a)*.7;z=Math.sin(a)*.7;y=-seedRandom()*.65;}
    sparkStart.set([x,y,z],i*3);
    const angle=seedRandom()*Math.PI*2,r=3+seedRandom()*8;
    sparkEnd.set([Math.cos(angle)*r,Math.sin(angle)*r*.5,-seedRandom()*12],i*3);sparkSeed[i]=seedRandom();
  }
  const sparkGeo=new THREE.BufferGeometry();sparkGeo.setAttribute('position',new THREE.BufferAttribute(sparkStart,3));sparkGeo.setAttribute('aEnd',new THREE.BufferAttribute(sparkEnd,3));sparkGeo.setAttribute('aSeed',new THREE.BufferAttribute(sparkSeed,1));
  const sparkUniforms={ uTime:{value:0},uMix:{value:0},uOpacity:{value:0},uDpr:{value:1} };
  const sparkMat=new THREE.ShaderMaterial({uniforms:sparkUniforms,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`attribute vec3 aEnd;attribute float aSeed;uniform float uTime,uMix,uDpr;varying float vSeed;void main(){vec3 p=mix(position,aEnd,uMix);p.y+=sin(uTime+aSeed*6.28)*.06*uMix;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((13.+aSeed*14.)*uDpr/max(1.,-mv.z),1.,7.);vSeed=aSeed;}`,
    fragmentShader:`uniform float uOpacity;varying float vSeed;void main(){float r=length(gl_PointCoord-.5);float a=(1.-smoothstep(.1,.5,r))*uOpacity*(.4+vSeed*.6);gl_FragColor=vec4(1.,.27+vSeed*.25,.04,a);}`
  });
  const sparks=new THREE.Points(sparkGeo,sparkMat);sparks.frustumCulled=false;scene.add(sparks);

  const satellites=new THREE.InstancedMesh(board.geometry,velvet,10);satellites.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(satellites);
  const dummy=new THREE.Object3D();
  function resize(){
    const width=canvas.clientWidth,height=canvas.clientHeight;if(!width||!height)return;
    mobile=width<650;quality=Math.min(quality,mobile?1.35:1.75);
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,quality));renderer.setSize(width,height,false);
    camera.aspect=width/height;camera.fov=mobile?48:38;camera.updateProjectionMatrix();
    bgUniforms.uAspect.value=width/height;codeUniforms.uPixelRatio.value=renderer.getPixelRatio();sparkUniforms.uDpr.value=renderer.getPixelRatio();
    codeGeo.setDrawRange(0,mobile?900:count);sparkGeo.setDrawRange(0,mobile?1000:sparkCount);
  }
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  const pointer = event => { if(event.pointerType==='touch')return;pointerX=event.clientX/innerWidth*2-1;pointerY=event.clientY/innerHeight*2-1; };
  const leave = () => { pointerX=0;pointerY=0; };
  const contextLost=event=>{event.preventDefault();lost=true;document.body.classList.remove('world-ready');document.body.classList.add('fallback-mode');};
  const contextRestored=()=>{lost=false;document.body.classList.remove('fallback-mode');document.body.classList.add('world-ready');};
  window.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);
  canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);
  document.body.classList.add('world-ready');
  function update(globalTime,dt,paused){
    if(disposed||hidden||lost||conductor.finale>=1){canvas.dataset.animationActive='false';return;}
    if(paused&&Math.abs(conductor.exact-progress)<.0001){canvas.dataset.animationActive='false';return;}
    if(!paused)time+=dt;
    lastProgress=conductor.exact;
    progress=lerp(progress,conductor.exact,1-Math.exp(-7*dt));
    const damping=1-Math.exp(-4*dt);px=lerp(px,pointerX,damping);py=lerp(py,pointerY,damping);
    let shot=0;while(shot<shots.length-2&&progress>shots[shot+1].at)shot++;
    const a=shots[shot],b=shots[shot+1],f=smooth(a.at,b.at,progress);
    for(let axis=0;axis<3;axis++){
      camera.position.setComponent(axis,lerp(a.camera[axis],b.camera[axis],f));
      look.setComponent(axis,lerp(a.target[axis],b.target[axis],f));
      cap.position.setComponent(axis,lerp(a.cap[axis],b.cap[axis],f));
    }
    cap.rotation.set(lerp(a.rotation[0],b.rotation[0],f),lerp(a.rotation[1],b.rotation[1],f),lerp(a.rotation[2],b.rotation[2],f));
    if(mobile){camera.position.z+=camera.aspect<.7?1:0;cap.position.x*=.38;cap.position.y-=.1;}
    else if(camera.aspect<1){camera.position.z+=1.3;cap.position.x*=.7;}
    camera.position.x+=px*.18;camera.position.y-=py*.12;look.x+=px*.065;look.y-=py*.04;camera.lookAt(look);
    cap.position.y+=Math.sin(time*.9)*.10;cap.rotation.y+=px*.065;cap.rotation.z+=Math.sin(time*.6)*.035;
    cap.scale.setScalar(lerp(a.scale,b.scale,f)*(mobile?Math.min(1.25,.78+camera.aspect*.4):(camera.aspect<1?.8:1)));
    const explode=lerp(a.explode,b.explode,f);
    cap.visible=explode<.88;
    tasselGroup.rotation.z=Math.sin(time*1.1)*.08;tasselGroup.rotation.x=Math.sin(time*.8)*.06;
    board.position.y=explode*.8;lower.position.y=-.073-explode*.5;band.position.y=-.48-explode*.9;
    sparks.position.copy(cap.position);sparks.rotation.copy(cap.rotation);sparkUniforms.uMix.value=explode;sparkUniforms.uOpacity.value=smooth(.02,.25,explode)*.9;sparkUniforms.uTime.value=time;
    terminalMaterial.opacity=smooth(.65,1.05,progress)*(1-smooth(1.75,2.1,progress))*.75;terminalGroup.visible=terminalMaterial.opacity>.001;terminalGroup.rotation.z=Math.sin(time*.18)*.025;
    const ringScale=lerp(a.ribbon,b.ribbon,f);ribbons.scale.setScalar(ringScale*(mobile?.86:1));ribbons.rotation.z=-.3+time*.035+progress*.6;ribbons.rotation.y=.3+Math.sin(time*.13)*.12;ribbons.position.z=-2-smooth(.8,1.8,progress)*7*(1-smooth(1.8,2.1,progress));
    codeUniforms.uTime.value=time;codeUniforms.uProgress.value=progress;codeUniforms.uOpacity.value=lerp(.4,.95,smooth(.6,1.3,progress))*(1-.65*smooth(2.7,3.3,progress));
    bgUniforms.uTime.value=time;bgUniforms.uProgress.value=progress;bgUniforms.uPointer.value.set(px,py);bgUniforms.uLoaded.value=lerp(bgUniforms.uLoaded.value,loaded?1:0,.04);
    const celebration=smooth(1.9,2.2,progress)*(1-smooth(2.7,3.05,progress));
    satellites.visible=celebration>.001;
    if(satellites.visible){
      for(let i=0;i<10;i++){
        const angle=i/10*Math.PI*2+time*.11,r=4+(i%3)*1.1;
        dummy.position.set(Math.cos(angle)*r,Math.sin(angle)*r*.6, -3-(i%3)*1.4);
        dummy.rotation.set(.5+i*.4,time*.15+i,Math.sin(time*.6+i)*.3);dummy.scale.setScalar(.11*celebration);dummy.updateMatrix();satellites.setMatrixAt(i,dummy.matrix);
      }satellites.instanceMatrix.needsUpdate=true;
    }
    orangeLight.intensity=40+Math.sin(time*.7)*4;
    const start=performance.now();renderer.render(scene,camera);
    const elapsed=performance.now()-start;
    if(frameCount++%30===0){clockHistory.push(elapsed);if(clockHistory.length>60)clockHistory.shift();}
    if(elapsed>25)slowFrames++;else slowFrames=Math.max(0,slowFrames-1);
    if(slowFrames>90&&quality>1){quality=Math.max(1,quality-.25);slowFrames=0;resize();}
    canvas.dataset.animationActive=String(!paused);canvas.dataset.chapter=String(Math.min(3,Math.floor(progress)));
    // Expose lightweight DOM diagnostics, readable by QA without application-state access.
    if(frameCount%90===0){canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.triangles=String(renderer.info.render.triangles);canvas.dataset.renderMs=elapsed.toFixed(2);canvas.dataset.dpr=renderer.getPixelRatio().toFixed(2);}
  }
  return { update,setHidden(value){ hidden=value;canvas.dataset.animationActive=String(!value); },dispose(){
    disposed=true;observer.disconnect();window.removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);
    const geometries=new Set(),materials=new Set();scene.traverse(object=>{ if(object.geometry)geometries.add(object.geometry);if(object.material)materials.add(object.material); });geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environment.dispose();renderer.dispose();document.body.classList.remove('world-ready');
  } };
}
