
//Fetch the songs from the song folder
async function getSongs(){
    let response = await fetch("http://127.0.0.1:5500/songs/");    
    response =await response.text()

    let div=document.createElement('div');
    div.innerHTML=response;

    let songLinks=div.querySelectorAll('a');
    let song=[];

    songLinks.forEach(links=>{
        let songName=links.innerText;
        let songUrl = links.href;

        if (songName && songUrl && songName !== '~'  && songName !== '..'  && songName !== 'songs') { // Exclude parent directory link
            song.push({ name: songName, url: songUrl });
        }
      

    })
    return song;
}

let main = async()=>{
    let songs= await getSongs();
    console.log(songs);
    let songUl= document.querySelector("ul.songList");
    let index=0;

    //Listing songs in playlist
    for(let song of songs){
        if(index>=0){
            let li=document.createElement('li');
            let img2= document.createElement('i');;
            img2.className="fas fa-play";
            li.innerText=song.name.split('.')[0];
            li.appendChild(img2);
            songUl.appendChild(li);
        }
        index++;

    }
    var audio= new Audio(songs[0].url);
    let playButton = document.querySelector(".playButtons .play");
    let previous=document.querySelector(".playButtons .prev");
    let next=document.querySelector(".playButtons .next");
    let liPlay= document.querySelectorAll(".songList li");
    let progressBar=document.querySelector("#progressBar");
    let timeStamp =document.querySelector(".playbar .timestamp");
    let songNameElement=document.querySelector(".songName");


    // Update song details
    const updateSongDetails = () => {
        if (currentSongIndex >= 0 && currentSongIndex < songs.length) {
            songNameElement.innerText = songs[currentSongIndex].name.split('.')[0];
        } else {
            console.error("Invalid currentSongIndex:", currentSongIndex);
        }    };

    //Play and pause the song through the playbutton
    playButton.addEventListener("click", ()=>{
        if(audio.paused || audio.currentTime<=0){
            audio.play();
        }
        else{
            audio.pause();
        }
    })


    //Play songs from the palylist
    let currentSongIndex=-1
    liPlay.forEach((li,index)=>{
        
        li.addEventListener("click",(evt)=>{


            let songname=evt.target.textContent;
            console.log(songname);
    
            songs.forEach((song, songIndex)=>{
                if(song.name.split('.')[0]==songname){
                    audio.src=song.url;
                    audio.play();
                    currentSongIndex=songIndex;
                    updateSongDetails();

                }
            })
          
            
        })
    })

    //songs precious and next button implementation
    previous.addEventListener("click", ()=>{
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        audio.src=songs[currentSongIndex].url;
        audio.play();
        updateSongDetails();
        
    })
    next.addEventListener("click",()=>{
        currentSongIndex = (currentSongIndex + 1 + songs.length) % songs.length;
        audio.src=songs[currentSongIndex].url;
        audio.play();
        updateSongDetails();
    })

    

    //update playRange according to the current duration
    audio.addEventListener("timeupdate",()=>{
        let progress=((audio.currentTime/audio.duration)*100)
        progressBar.value=progress
    })

    progressBar.addEventListener("change",()=>{
        audio.currentTime=progressBar.value*audio.duration/100;
    })
    // Display Timestamp
    audio.addEventListener("timeupdate",()=>{
        let minutes=Math.floor(audio.currentTime/60);
        let seconds=Math.floor(audio.currentTime%60);
        timeStamp.innerText= `${minutes} : ${seconds}`;
    })


   updateSongDetails();


    
}

main()



