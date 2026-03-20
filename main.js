document.addEventListener("DOMContentLoaded", function () {
const btn1=document.getElementById('btn1')
const btn2=document.getElementById('btn2')
const contain = document.getElementById('container')
let audioCtx
const audio = new Audio()
audio.crossOrigin = "anonymous"
const sources=[{src:"audiosrc1.mp3",color:'pink'},{src:"audiosrc2.mp3",color:'green'},{src:"audiosrc3.mp3",color:'blue'},{src:"audiosrc4.mp3",color:'white'}]
let selected=0
// audio.src = sources[0].src

let audiosrc
let analizer
let isplaying=false
let isInitialized = false;
async function audioUrlToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob(); // Convert response to a binary blob
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // result is the Base64 string
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Triggers the conversion
    });
  }
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.style.width = '100vw';
canvas.style.height = '95vh';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.95;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const playaudio= async()=>{
//  let baseurl=await audioUrlToBase64('audiosrc1.mp3')
//     let audio=new Audio(baseurl)
const runaudio=(newSrc)=>{

    if (!audioCtx) {
        audioCtx = new AudioContext()
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    }

        if (newSrc && audio.src !== new URL(newSrc, window.location.href).href) {
            audio.pause(); 
            audio.src = newSrc;
            audio.load(); 
            isplaying = false;  
        }
        if (!isplaying) {
            audio.play();
            isplaying = true;
            // ONLY CONNECT ONCE - This prevents the crash
            if (!isInitialized) {
            audio.play()
            audiosrc=audioCtx.createMediaElementSource(audio)
            analizer=audioCtx.createAnalyser()
            audiosrc.connect(analizer)
            analizer.connect(audioCtx.destination)
            analizer.fftSize=64
            bufferLength=analizer.frequencyBinCount
            const dataArry= new Uint8Array(bufferLength)
            const barwidth=canvas.width/bufferLength
            
            let x

            const runBarAimtie=()=>{
               
                x=0
                ctx.clearRect(0,0,canvas.width,canvas.height)
                ctx.fillStyle = 'black'; 
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                analizer.getByteFrequencyData(dataArry)
                for (let index = 0; index < bufferLength; index++) {
                    const barheight = dataArry[index]*2;
                    ctx.shadowColor = 'black'; // Shadow color
                    ctx.shadowBlur = 10;        // Blur amount
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
            
                    // 3. Draw the main pink bar
                    ctx.fillStyle = sources[selected].color;
                    ctx.fillRect(x, canvas.height - barheight, barwidth - 1, barheight);
            
                    // 4. Add Border (Stroke)
                    ctx.strokeStyle = 'black';  // Border color
                    ctx.lineWidth = 2;          // Border thickness        // Border thickness
                    
                    ctx.fillRect(x,canvas.height-barheight,barwidth,barheight)
                    x+=barwidth
                }
                requestAnimationFrame(runBarAimtie)

            };
            runBarAimtie();
            isInitialized = true;
            
            }}
            else{
            audio.pause()
            audio.currentTime = 0; 
            isplaying=false
            }
    }
    btn1.addEventListener('click',(e)=>{
        e.stopPropagation()
        selected = (selected + 1) % sources.length; 
        runaudio(sources[selected].src)
    })
    btn2.addEventListener('click',(e)=>{
        e.stopPropagation()
        selected = (selected - 1 + sources.length) % sources.length;
        runaudio(sources[selected].src)
    })
    contain.addEventListener('click',()=>{
       
        runaudio(sources[selected].src)
    })
}
playaudio()
})