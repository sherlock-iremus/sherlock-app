import SherlockBar from '@/components/deco/SherlockBar'
import SherlockLogo from './SherlockLogo'
import Link from '@/components/buttons-and-links/Link'

const VBar = () => <div className='bg-stone-700 w-[1px]'></div>

export default () => <footer className='flex flex-col flex-1 bg-background font-mono text-foreground text-sm dark'>
    <SherlockBar />
    <div className='flex mt-11 text-gray-500'>
        <div className="flex-1 mx-11 text-right">
            <Link href="https://musica.hypotheses.org/" target='_blank'>Musica2</Link>
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
            <Link href="https://www.iremus.cnrs.fr/" target='_blank'>Institut de Recherche en Musicologie</Link>
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