
import './navebar.css'
import ConnectWallet from './ConnectWallet';


import Link from 'next/link';

export default function Navbar() {
    return (
        <div className='w-full absolute text-white z-10'>
            <nav className='container relative flex flex-wrap items-center justify-between mx-auto p-8'>
                <div className="flex justify-center gap-4">

                    <img src="/images/Logo.png" alt="Logo" className='h-[50px]' />
                </div>
                <Link href='/' className='font-bold text-3xl'> Awo </Link>
                <div className='flex space-x-4 text-xl ml-auto'>
                    <div>
                        <Link href='/mint'> MintNFT </Link>
                    </div>
                    <div>
                        <Link href='/markets'> Markets </Link>
                    </div>
                    <div>
                        <Link className='mr-2' href='/account'> Account </Link>
                    </div>
                </div>
                <ConnectWallet />
            </nav>
        </div>
    )
}