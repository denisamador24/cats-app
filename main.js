const API_AX = axios.create({
  baseURL: 'https://api.thecatapi.com/v1'
})
API_AX.defaults.headers.common['X-API-KEY'] = '57f7a9b2-6b46-4cc2-979a-c62ee1580d6d'

const API = 'https://api.thecatapi.com/v1'
const API_KEY = '57f7a9b2-6b46-4cc2-979a-c62ee1580d6d'
const API_DELETE = (id)=> `${API}/favourites/${id}?api_key=${API_KEY}`

const img1 = document.getElementById('rImg1');
const img2 = document.getElementById('rImg2');
const img3 = document.getElementById('rImg3');

const content = document.getElementById('favorites__container')


let data = []

async function loadRandomCats(){
  const response = await fetch(API+'/images/search?limit=3');
  data = await response.json();
  img1.src = data[0].url;
  img2.src = data[1].url;
  img3.src = data[2].url;
  console.log('load ', data);
}

async function loadFavoriteCats(){
  try{
    const res = await fetch(API+'/favourites', {
      headers: {
        method: 'GET',
        'x-api-key': API_KEY
      }
    })
    const favorite = await res.json()
    
    
    favorite.forEach(it =>{
      const view = document.createElement('figure')
      const img = document.createElement('img')
      img.src = it.image.url
      const btnDelete = document.createElement('button')
      btnDelete.innerText = 'Delete'
      //btnDelete.onclick = ()=> deleteCat(it.id)
      btnDelete.onclick = ()=> deleteCat(it.id, view)
      view.appendChild(img)
      view.appendChild(btnDelete)
      
      content.appendChild(view)
    })
    console.log('Favorite ', favorite);
  } catch (err) {
    console.log('favorite', err);
  }
}

async function saveFavoriteCat(bt){
  try{
    const {status} = await API_AX.post('/favourites', {
      image_id: data[bt].id
    })
    /*
    const res = await fetch(API+'/favourites', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        'image_id': data[bt].id
      })
    })
    */
    
    if(status === 200){
      alert('Save cat correct')
      content.innerHTML = ''
      loadFavoriteCats()
    } else {
      alert('No se pudo guardar en favorito')
    }
    
  } catch (err) {
    console.log('Save ', err)
    alert('No se pudo guardar en favorito')
  }
}
const deleteCat = async (id, view) => {
  const res = await fetch(API_DELETE(id), {
    method: 'DELETE'
  })
  content.removeChild(view)
  console.log('delete ',res);
}
async function uploadCatPhoto(){
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);
  console.log(formData.get('file'));
  
  const res = await fetch(API+'/images/upload', {
    method: 'POST',
    headers: {
      'X-API-KEY': API_KEY
    },
    body: formData
  })
  const data = res.json();
  console.log(data);
}
loadRandomCats()
loadFavoriteCats()
