
let app = {
    storeData: [],
    mediaType: null,
    showType: null,
    show_id: null,
    pages: [],
    show: new Event('show'),
    APIKEY: 'b5d9202754d9965d7147b5fb11efa10c',
    baseURL: 'https://api.themoviedb.org/3/',
    img_link: 'https://image.tmdb.org/t/p/',

    init: function(){
        app.pages = document.querySelectorAll('.page');
        app.pages.forEach((pg)=>{
            pg.addEventListener('show', app.pageShown);
        })
        document.getElementById('fbtn').addEventListener('click', app.backHome);
        document.getElementById('btn').addEventListener('click', app.processForm);
        document.getElementById('fbtn').classList.remove('fbtnActive');
        document.getElementById('fbtn').classList.add('btnNotActive');

        history.replaceState({}, 'Home', '#home');
        window.addEventListener('popstate', app.poppin);
    },

    //fab button, taking to home page
    backHome: function(){                      
        document.querySelector('.active').classList.remove('active');
        document.getElementById('home').classList.add('active');
        document.getElementById('search').value= " ";
        document.getElementById('fbtn').classList.remove('fbtnActive');
        document.getElementById('fbtn').classList.add('btnNotActive');
    },

    //creating list of actors page depending on input
    processForm: function(ev){
        ev.preventDefault();
        let name = document.getElementById('search');

        if(name.value.length == 0){
            alert("Please Enter a Name");   //if nothing entered give them alert
        }else{
            let currentPage = ev.target.getAttribute('data-target');
            document.querySelector('.active').classList.remove('active');
            document.getElementById(currentPage).classList.add('active');
            history.pushState({}, currentPage, `#${currentPage}`);
            document.getElementById(currentPage).dispatchEvent(app.show);

            let value = name.value;

            // window.scrollTo(0,0);

            let url = ''.concat(app.baseURL, 'search/person?api_key=', app.APIKEY, '&query=', value);

            fetch(url)
            .then(response =>{
                return response.json();
            })

            .then(actors =>{
                let data = actors.results;
                app.storeData = data;//storing fetch data in one global variable

                //if user clicked search button twice in one run clear previous html
                document.getElementById('list').innerHTML= " ";
                document.getElementById('details').innerHTML = " ";
                document.getElementById('detail').innerHTML= " ";

                document.getElementById('fbtn').classList.remove('btnNotActive');
                document.getElementById('fbtn').classList.add('fbtnActive');
                let df = new DocumentFragment();
                let h2 = document.createElement('h1');
                h2.textContent = "ACTORS";
                let search_phrase = document.createElement('h3');   
                //search phrase from user
                search_phrase.textContent = "Related Results to" + " " + value;
                for (let i=0; i<data.length; i++) {

                    let actual_data = data[i];
                    console.log(actual_data);
                    let a = document.createElement('p');
                    let div = document.createElement('div');
                    let profile = actual_data.profile_path;

                    let pimg = document.createElement('img');

                    if(profile == null){
                        pimg.setAttribute('src','img/default_image.jpg')
                    }else{

                    pimg.setAttribute('src', app.img_link + 'w342/'+ profile);
                    }
                    pimg.setAttribute('alt', "Profile Picture");
                    
                    div.setAttribute('href',"#");
                    // div.setAttribute('data-target', "details");
                    // div.setAttribute('id', [i]);
                    // a.setAttribute('id_i', actual_data.id);
                    div.setAttribute('class', "nav-link");
                    a.textContent =actual_data.name;

                    a.setAttribute('data-target', "details");
                    pimg.setAttribute('data-target', "details");
                    div.setAttribute('data-target', "details");

                    a.setAttribute('id', [i]);
                    pimg.setAttribute('id', [i]);
                    div.setAttribute('id', [i]);




                    div.appendChild(pimg);
                    div.appendChild(a);
                    df.appendChild(div);
                    div.addEventListener('click', app.nav);


        //let div = ev.target.closest('[data-id]');
        //let currentPage = ev.target.getAttribute('data-target');
                }
                // document.getElementById('list').appendChild(h2);
                document.getElementById('list').appendChild(search_phrase);
                document.getElementById('list').appendChild(df);

            })
            .catch(err =>{
                console.error(err);
                alert("An error occured. Please try again.");
            });
        }
    },

    //creating 3rd(movie list) page
    nav: function(ev){
        ev.preventDefault();
        //let div = ev.target.closest('[data-id]');
        let currentPage = ev.target.getAttribute('data-target');
        console.log(currentPage)
        document.querySelector('.active').classList.remove('active');
        document.getElementById(currentPage).classList.add('active');
        history.pushState({}, currentPage, `#${currentPage}`);
        document.getElementById(currentPage).dispatchEvent(app.show);

        //clearing previous html
        document.getElementById('details').innerHTML = " ";
        document.getElementById('detail').innerHTML= " ";

        document.getElementById('fbtn').classList.remove('btnNotActive');
        document.getElementById('fbtn').classList.add('fbtnActive');

        let person = app.storeData[ev.target.id];
        let movies = person.known_for;
        let h3 = document.createElement('h1');
        h3.textContent = "MOVIES";
        let actore_name = document.createElement('h2');
        actore_name.textContent = person.name;
        let df = new DocumentFragment();
            for (let i=0; i<movies.length; i++) {
                let actual_movies = movies[i];
                console.log(actual_movies);
                app.mediaType = actual_movies.media_type;
                let divm = document.createElement('div');
                let a = document.createElement('p');
                let mpimg = document.createElement('img');
                let mposter = actual_movies.poster_path;
                if(mposter == null){
                    mpimg.setAttribute('src','img/default_image.jpg')
                }else{
                mpimg.setAttribute('src', app.img_link + 'w342/' + mposter);
                }
                mpimg.setAttribute('alt', "Movie Poster");
                a.setAttribute('href',"#");
                // a.setAttribute('data-target', "detail");
                // a.setAttribute('id', actual_movies.id);
                a.setAttribute('class', "movie-link");
                if (app.mediaType == "movie"){
                a.textContent = "Movie: " + actual_movies.title;
                }else{
                    a.textContent = "TV Show: "+ actual_movies.name;
                }

                a.setAttribute('data-target', "detail");
                a.setAttribute('id', actual_movies.id);a.setAttribute('data-target', "detail");
                divm.setAttribute('id', actual_movies.id);a.setAttribute('data-target', "detail");
                divm.setAttribute('id', actual_movies.id);
                mpimg.setAttribute('data-target', "detail");
                mpimg.setAttribute('id', actual_movies.id);
                divm.appendChild(mpimg);
                divm.appendChild(a);
                df.appendChild(divm);
                divm.addEventListener('click', app.movie);
            }
            document.getElementById('details').appendChild(h3);
            document.getElementById('details').appendChild(actore_name);
            document.getElementById('details').appendChild(df);
            console.log(window.location.href);
            console.log(window.location.pathname);
    },

    //creating 4th(movie detail) page
    movie:function(ev){

        ev.preventDefault();
        let currentPage = ev.target.getAttribute('data-target');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(currentPage).classList.add('active');
        history.pushState({}, currentPage, `#${currentPage}`);
        document.getElementById(currentPage).dispatchEvent(app.show);

        document.getElementById('detail').innerHTML= " ";

        document.getElementById('fbtn').classList.remove('btnNotActive');
        document.getElementById('fbtn').classList.add('fbtnActive');

        let movie_id = parseInt(ev.target.id);
        console.log(movie_id);
        let tv_id = parseInt(ev.target.id);

        if(app.mediaType == "movie"){
            app.showType = 'movie/';
            app.show_id = movie_id;
        }else{
            app.showType = 'tv/';
            app.show_id = tv_id;
        }
        let url2 = ''.concat(app.baseURL, app.showType ,app.show_id,'?api_key=', app.APIKEY);
        console.log(url2);
        let url3 = ''.concat(app.baseURL, app.showType ,app.show_id,'/credits?api_key=', app.APIKEY);
        fetch(url2)
        .then(response =>{
            return response.json();
        })
        .then(movie =>{
            console.log(movie);
            let genres_movie = movie.genres;
            let poster = movie.poster_path;

            let divd = document.createElement('div');
            divd.setAttribute('id', "div");
            let img = document.createElement('img');
            img.setAttribute('src', app.img_link + 'w500/' +poster);
            img.setAttribute('alt', "Movie Poster");

            let h4 = document.createElement('h1');
            let h1 = document.createElement('h2');
            let p1 = document.createElement('p');
            h4.textContent = "DETAILS";
            // divd.appendChild(h4);
            divd.appendChild(img);
            if(app.mediaType == "movie"){
            p1.textContent = "Release Date: " + movie.release_date;
            h1.textContent =  movie.title;
            }else{
                p1.textContent = " First Air Date: " + movie.first_air_date;
                h1.textContent =  movie.name;
            }
            divd.appendChild(h1);
            divd.appendChild(p1);
            
            let df2 = new DocumentFragment();
            let pp = document.createElement('p');
            pp.textContent= "Generes: ";
            divd.appendChild(pp);
            let movie_title = document.createElement('h2');
            movie_title.textContent = movie.title;
            for (let i=0; i<genres_movie.length; i++) {

                let actual_movie = genres_movie[i];
                
                let p2 = document.createElement('a');
                p2.textContent = actual_movie.name;
                df2.appendChild(p2);
            }
            divd.appendChild(df2);

            // document.getElementById('detail').appendChild(movie_title);
            document.getElementById('detail').appendChild(divd);
            fetch(url3)
        .then(response_cast =>{
            return response_cast.json();
        })
        .then(cast =>{
            let movie_cast = cast.cast;
            let df3 = new DocumentFragment();
            let div_cast = document.createElement('div');
            div_cast.setAttribute('id', 'cast');
            let cast_heading = document.createElement('h4');
            cast_heading.textContent = "cast";
            for (let i=0; i<movie_cast.length; i++) {

                let cast_list = movie_cast[i];
                let divdd = document.createElement('div');
            divdd.setAttribute('id', 'cast_div');
                let cimg = document.createElement('img');
                if(cast_list.profile_path == null){
                    cimg.setAttribute('src','img/default_image.jpg')
                }else{
                cimg.setAttribute('src', app.img_link + 'w154/' + cast_list.profile_path);
                }
                cimg.setAttribute('alt', cast_list.name +"picture");
                cimg.setAttribute('id','image');
                divdd.appendChild(cimg);

                let p4 = document.createElement('p');
                p4.textContent = cast_list.name;
                divdd.appendChild(p4);
                df3.appendChild(divdd);
            }
            div_cast.appendChild(cast_heading);
            div_cast.appendChild(df3);
            document.getElementById('detail').appendChild(div_cast);
        })
        .catch(err =>{
            console.error(err);
            alert("An error occured. Please try again.");
        });
        })
        .catch(err =>{
            console.error(err);
            alert("An error occured. Please try again.");
        }); 
    },

    poppin: function(ev){
        let hash = location.hash.replace('#' ,'');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hash).classList.add('active');
        document.getElementById(hash).dispatchEvent(app.show);
    }
}



let ready = ('cordova' in window)?"deviceready":"DOMContentLoaded";
document.addEventListener(ready, app.init);