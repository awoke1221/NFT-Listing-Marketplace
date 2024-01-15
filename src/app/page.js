import Hero from '@components/Hero'
import homeimage from '../../public/home.jpg'


export default function Home() {
  return (
    <Hero imgData={homeimage} imgAlt='Car factory'  title='NFT Market Place Mint your NFTs' />
    
  )
}
