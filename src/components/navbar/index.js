
import Link from 'next/link';
//import ConnectWallet from './ConnectWallet';

export default function Navbar() {
    return (
        <header className=" bg-[#f9f1f1eb] navbar">
            <nav className=" container flex items-center justify-between mx-auto p-8">
                <div className="flex items-center gap-4">
                    <Link href="/markets" className="flex items-center gap-4">
                        <img src="/images/Logo.png" alt="Logo" className='h-[60px]' />
                        <h1 className='font-bold text-3xl'>Awo</h1>
                    </Link>
                </div>

                <div className='flex space-x-4 text-xl ml-auto'>
                    <ul className="flex space-x-4 text-xl">
                        <li>
                            <Link href="/mint">
                                MintNFT
                            </Link>
                        </li>
                        <li>
                            <Link href="/markets">
                                Markets
                            </Link>
                        </li>
                        <li>
                            <Link href="/mynft">
                                MyNFT
                            </Link>
                        </li>
                        <li>
                            <Link href="/account" className='mr-2'>
                                Account
                            </Link>
                        </li>
                    </ul>
                </div>
                
                {/* Hamburger menu for mobile */}
                {/* Add a responsive menu toggle button here */}
            </nav>
        </header>
    )
}