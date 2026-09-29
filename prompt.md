

Filen bundle.js gör det möjligt att visa "model.glb"

Efter det att bundle.js exekverats placeras elementet i stil med: 

```js
<main>
    <!-- andra element -->

    <canvas id="webgl" width="1254" height="945" data-engine="three.js r186" style="width: 1254px; height: 945px; cursor: auto; touch-action: none;"></canvas>

    <!--  -->
</main>
```


I css filen har jag angett:

```css
#webgl {
    width: 100%;
    height: 100%;
    max-width: fit-content;
    max-height: fit-content;
    display: block;
}

```


Varför har attributen width och height högre värden än vad jag angivit? Ska jag ange fast pixelmått för max-width och `!important` direktiv?


Jag vill säkerställa att modellen visas innanför html elementet main.

Jag använder följande JavaScript DOM manipulation

```js
			document.addEventListener("DOMContentLoaded", (e) => {
				const main = document.querySelector("main");
				const canvas = document.getElementById("webgl");
				canvas.remove();
				if (main) {
					main.appendChild(canvas);
				}
			}); 

```

Det fungerar dock inte, vilket gör att modellen inte är centrerad utan placeras i högerkanten. Hur kan jag bäst bestämma maximal bredd på canvas elementet
