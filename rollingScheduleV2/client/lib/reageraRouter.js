
const renderRoute = (path, routes,targetElementSelector)=>{
    let pathnameClean = path.substring(1);
    window.history.pushState(pathnameClean, pathnameClean, path);
    let content = routes[pathnameClean]().render();
    let domContent = new DOMParser().parseFromString(content,'text/html');
    let routingRoot  =document.querySelector(targetElementSelector).firstElementChild;
    if(routingRoot === null){
        document.querySelector(targetElementSelector).appendChild(domContent.body.firstElementChild);
    }
    else{
        document.querySelector(targetElementSelector).firstElementChild.replaceWith(domContent.body.firstElementChild);

    }
}

export const InitRouter = (routes,targetElementSelector)=> {
    document.addEventListener('click', (event) => {
        if (
          event.target.tagName === 'A' &&
          event.target.origin === location.origin
        ) {
            event.preventDefault();
            let path = URL.parse(event.target.href).pathname;
            renderRoute(path,routes,targetElementSelector);
        }
      })
      
    window.addEventListener('load', ()=>{
        renderRoute(window.location.pathname, routes,targetElementSelector);
    }, false);
    
}
