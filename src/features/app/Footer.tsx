import SherlockLogo from './SherlockLogo'

const VBar = () => <div className='bg-stone-700 w-[1px]'></div>

export default () => <footer className='flex flex-col flex-1 bg-black py-11 border-stone-200 text-stone-400 text-sm'>
    <div className='flex'>
        <div className="flex-1 mx-11 text-right">
            <a href="https://musica.hypotheses.org/" target='_blank'>Musica2</a>
            <br />
            <br />
            Consortium en musicologie numérique
            <br />
            IR* Huma-Num, CNRS
        </div>
        <VBar />
        <div className="flex flex-col items-center px-11">
            <SherlockLogo />
            <br />
            <br />
            <div>🌲🌲 📡 🌲🌲</div>
        </div>
        <VBar />
        <div className='flex-1 mx-11'>
            <a href="https://www.iremus.cnrs.fr/" target='_blank'>Institut de Recherche en Musicologie</a>
            <br />
            <br />
            UMR 8223
            <br />
            CNRS
        </div>
    </div>
    <div className='flex flex-1 justify-center mt-11'>

    </div>
</footer>