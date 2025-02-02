// b.includes("%5BiSongs.info%5D%20-")

// http://127.0.0.1:5500/songs/devera/%5BiSongs.info%5D%20-%20Ayudha%20Pooja.mp3
// http://127.0.0.1:5500/songs/guntur%20karam/Kurchi%20Madathapetti.mp3
let folders = []
let songs = []
let allsongs = []
let currentTime = 0
let duration = 0
//getting all folders
//stage - 1 
async function getfolders() {
    let response = await fetch("http://127.0.0.1:5500/songs/")
    let text = await response.text()
    let divF = document.createElement("div")
    divF.innerHTML = text

    let folder_atag = divF.getElementsByTagName("a")

    for (const element of folder_atag) {

        if (element.href.includes("/songs/")) {
            folders.push(element)
        }
    }
    // console.log(folders);
}
//stage-3
function getfolder_name(folder) {
    let href = folder.href.split("/")
    let folder_name = href.pop()
    folder_name = folder_name.replaceAll("%20", " ")
    // console.log(folder_name)
    return folder_name

}
//getting songs of one folder
//stage-2
async function getsongs(folder) {
    let response = await fetch(`http://127.0.0.1:5500/songs/${folder}/`)
    let text = await response.text()
    let divS = document.createElement("div")
    divS.innerHTML = text
    let song_atag = divS.getElementsByTagName("a")
    for (const element of song_atag) {
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    // console.log(songs);
    return songs
}
//getting all songs from all folders
async function getAllsongs(folders) {
    for (const folder of folders) {
        let response = await fetch(`http://127.0.0.1:5500/songs/${getfolder_name(folder)}/`)
        let text = await response.text()
        let divS = document.createElement("div")
        divS.innerHTML = text
        let song_atag = divS.getElementsByTagName("a")
        for (const element of song_atag) {
            if (element.href.endsWith(".mp3")) {
                allsongs.push(element.href)
            }
        }

    }
    // console.log(allsongs);
}
function getsong_name(song) {
    // console.log(song);
    let splited_href = song.split(".mp3")
    let temp = splited_href[0].split("/")
    let temp2 = temp[temp.length - 1]
    let temp3 = temp2.split("-")
    let name = temp3[temp3.length - 1]
    name = name.replaceAll("%20", " ")
    return name
}

function addsongs(songbox, songs) {
    console.log(songs);
    
    // console.log(allsongs)
    for (const element of songs) {
        songbox.innerHTML += `<li>
                        <div class="songli">
                            <i class="fa-solid fa-music"></i>
                            <div id="name">${getsong_name(element)}</div>
                            <div id="song_href">${element}</div>
                            <div class="playnow">
                                <p>Play now</p>
                                <i class="fa-solid fa-play"></i>
                            </div>
                        </div>
                    </li>`
    }
}

function getFolderName_throughSong(song) {
    let temp = song.split("/")
    let folder_name = temp[4]
    return folder_name
}


function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return '----';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const Fmin = String(minutes).padStart(2, '0')
    const Fsec = String(remainingSeconds).padStart(2, '0')

    return `${Fmin}:${Fsec}`;
}


let totaltime
let Currtime

let seektop = document.querySelector(".seektop")
let Duration = seektop.querySelector(".duration")
let seekline = document.querySelector(".seekline")
let pointer = seekline.querySelector(".pointer")
let c, d, percentage;
let song = new Audio()
function playsong(songname) {
    if (song.src !== songname) {
        // If the song is different, set the new source and play
        song.src = songname;
        song.play();
    } else if (song.paused) {
        // If it's the same song and paused, just play it again (resume)
        song.play();
    }

}
function pausesong(songname) {
    song.src = songname
    song.pause()
}
//seekbar related

let albumGrid = document.getElementsByClassName("album_grid")[0]

function addFolderToGrid() {
    console.log("adding albums to grid");
    albumGrid.innerHTML=' '
    for (const element of folders) {
        let folderName = getfolder_name(element)
        // console.log(`added ${folderName}`);
        
        // console.log(element.href);
        albumGrid.innerHTML += `<div class="album">
                    <div class="image">
                        <img src="songs/${folderName}/coverpage.jpg" alt="">
                    </div>
                    <div class="title">${folderName}</div>
                    <div id="folder_href">${element.href}</div>
                </div>`
    }
}
let playing
let previousList = null
let previoussong = null
let songlis
let songname
let current

//for html in albums
let Clname = 'fa-play'
let seekSong
let Sduration
let icon2
let previous
let sprevious = null
function seekbar(element, icon, current, songname, playing, previous, Cname, previoussong) {
    Clname = Cname
    seekSong = getsong_name(songname)
    let seektop = document.querySelector(".seektop")
    let seek_play = seektop.getElementsByTagName("i")[0]
    seek_play.className = Cname
    let seek_songname = seektop.getElementsByTagName("h3")[0]
    // seek_songname.innerHTML = getsong_name(songname)

    seek_songname.innerHTML = `<p>Now playing</p>${getsong_name(songname)}</h3>`

    seek_play.addEventListener("click", () => {
        console.log(element);

        let icon = element.getElementsByTagName("i")[1]
        if (previous != null) {
            let icon2 = previous.getElementsByTagName("i")[1]
            icon2.className = 'fa-solid fa-play'
        }
        if (playing) {
            seek_play.className = 'fa-solid fa-play'
            icon.className = 'fa-solid fa-play'
            song.pause()
            playing = false
        }
        else if (!playing) {
            seek_play.className = 'fa-solid fa-pause'
            icon.className = 'fa-solid fa-pause'
            song.play()
            playing = true
        }

    })
    previoussong = songname

}

function eventsTosongList() {
    songlis = document.getElementsByClassName("songli")
    previous = null
    playing = false
    for (const element of songlis) {
        element.addEventListener("click", () => {
            songname = element.querySelector("#song_href").innerHTML;
            let icon = element.getElementsByTagName("i")[1]
            current = element
            if (!playing || current != previous) {
                if (previous != null) {
                    let icon2 = previous.getElementsByTagName("i")[1]
                    icon2.className = 'fa-solid fa-play'
                }
                icon.className = 'fa-solid fa-pause'
                playsong(songname)
                // console.log(`sent ${element, songname}`);

                playing = true
                seekbar(element, icon, current, songname, playing, previous, 'fa-solid fa-pause', previoussong);

            }
            else {
                if (playing) {
                    // If the song is playing, pause it
                    icon.className = 'fa-solid fa-play'; // Set icon to play
                    // console.log(`sent ${element, songname}`);

                    song.pause();
                    playing = false;
                    seekbar(element, icon, current, songname, playing, previous, 'fa-solid fa-play', previoussong);
                } else {
                    // If the song is paused, resume it
                    icon.className = 'fa-solid fa-pause'; // Set icon to pause
                    // console.log(`sent ${element, songname}`);

                    song.play();
                    playing = true;
                    seekbar(element, icon, current, songname, playing, previous, 'fa-solid fa-play', previoussong);
                }
            }
            previous = element
            previoussong = songname
        })
    }
}
async function backActionlistner(){
    let right = document.getElementsByClassName("right")[0]
    right.innerHTML = ''
    right.innerHTML += ` <div id="h1">
         <h1>Albums for you</h1>
            </div>
            <div class="albums">
                <div class="album_grid"></div>
            </div>
            <div class="library" id="quickpicks">
                <div id="h2">
                    <h1>Quick picks</h1>
                </div>
                <div class="picks">
                    <ul>
    
                    </ul>
    
                </div>`
    
    let albumGrid = document.getElementsByClassName("album_grid")[0]
    console.log(albumGrid);
    
    albumGrid.innerHTML=' '
    songs=[]
    for (const element of folders) {
        let folderName = getfolder_name(element)
        albumGrid.innerHTML += `<div class="album">
                    <div class="image">
                        <img src="songs/${folderName}/coverpage.jpg" alt="">
                    </div>
                    <div class="title">${folderName}</div>
                    <div id="folder_href">${element.href}</div>
                </div>`
    }
    
    // addFolderToGrid()
    let picks = document.getElementsByClassName("picks")[0];
    let picks_ul = picks.getElementsByTagName("ul")[0];
    addsongs(picks_ul, allsongs)
            
    //adding event listners to songs in quick picks
    eventsTosongList()
    //adding event listeners to album
    addEventsToAlbums()
    let back = document.querySelector(".header")
    back.style.visibility = "hidden"
    // addEventsToAlbums()
 
}
function addEventsToAlbums(){
    let albums = document.getElementsByClassName("album")
    let right = document.getElementsByClassName("right")[0]

    for (const album of albums) {
        album.addEventListener("click", async () => {
            // console.log("hello");

            let folderHref = album.querySelector("#folder_href").innerHTML
            let Fname = getsong_name(folderHref);
            songs = await getsongs(Fname)
            // console.log(songs);

            right.innerHTML = ''
            right.innerHTML += `
            <div class="header">
            <i class="fa-solid fa-arrow-left"></i>
        </div>
        <div id="folder">
            <h1>${Fname}</h1>
        </div>
       <div class="poster">
        <div class="album_inpage">
            <div class="image">
                <img src="songs/${Fname}/coverpage.jpg" alt="">
            </div>
        </div>
       </div>
            <div class="songs">
                <ul id="folderSongsList">
                    
                </ul>
            </div>
            
        </div>
            `
            let img = document.querySelector(".image").getElementsByTagName("img")[0]
            img.style.borderRadius="12px"
            let list = right.querySelector("#folderSongsList")
            list.innerHTML = ''
            addsongs(list, songs)
            eventsTosongList()
            let back = document.querySelector(".header")
            back.style.visibility = "visible"
            back.addEventListener("click",backActionlistner)
            
            
        })
    }
}

async function main() {
    await getfolders();
    await getAllsongs(folders)
    let picks = document.getElementsByClassName("picks")[0];
    let picks_ul = picks.getElementsByTagName("ul")[0];
    addsongs(picks_ul, allsongs)

    //adding event listners to songs in quick picks
    eventsTosongList()
    addFolderToGrid()
    let songs
    //adding event listeners to album
   addEventsToAlbums()

    song.addEventListener("timeupdate", () => {
        totaltime = formatTime(song.duration);
        Currtime = formatTime(song.currentTime)
        Duration.innerHTML = `${Currtime} / ${totaltime}`
        c = song.currentTime
        d = song.duration
        percentage = (c / d)
        pointer.style.left = `${percentage * 100}%`

    });
    seekline.addEventListener("click", e => {
        let pointerPER = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        pointer.style.left = `${pointerPER}%`
        song.currentTime = (pointerPER * song.duration) / 100

    })
    let burger = document.getElementsByClassName("burger")[0]
    let open = false
    let screenwidth = window.innerWidth
    console.log(screenwidth);
    
    burger.addEventListener("click",()=>{
        console.log("tototo");
        
        let left = document.getElementsByClassName("left")[0]
        if(!open){
            left.style.visibility="visible"
            open=true
            burger.style.backgroundColor="#a6b893"
        }else{
            left.style.visibility="hidden"
            open=false
            burger.style.backgroundColor="#e8ddc9"

        }
    })
}
main()

