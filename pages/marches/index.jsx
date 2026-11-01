import Seo from '../../components/layout/Seo'
import PageIntro from '../../components/ui/PageIntro'
import MarketsTable from '../../components/ui/MarketsTable'
import { getMarketsRows, REVALIDATE } from '../../lib/marketData'
import s from '../../styles/Hub.module.css'

export default function Marches({ rows }) {
  return (
    <>
      <Seo
        title="Marchés : performances et pires baisses en euros"
        description="Bitcoin, Ethereum, CAC 40, S&P 500, MSCI World, or : performance sur 1 et 5 ans et pire baisse historique, calculées en euros."
      />
      <PageIntro
        crumbs={[{ label: 'Marchés' }]}
        title="Situer un actif en trois chiffres."
        lede="Sa performance sur un an, sur cinq ans, et la pire baisse qu’il a connue. Le troisième chiffre est souvent le plus utile : c’est ce qu’il faut être prêt à traverser."
        wide
      />
      <div className="wrap" style={{ paddingBottom: 'var(--section)' }}>
        <MarketsTable rows={rows} location="hub_marches" />
        <section className="section prose" style={{ paddingBottom: 0 }}>
          <h2>Comment lire ce tableau</h2>
          <p>
            Toutes les valeurs sont calculées à partir des clôtures mensuelles, converties en euros pour les actifs cotés en dollars.
            Une hausse en dollars peut donc être plus faible, voire négative, en euros si le dollar a baissé sur la période.
          </p>
          <p>
            Les indices boursiers sont publiés hors dividendes. Un ETF qui réinvestit les dividendes a fait mieux que l’indice affiché ici.
            Les performances passées ne préjugent pas des performances futures.
          </p>
          <h2 id="sources">D’où viennent les cours en direct</h2>
          <p>
            Le bandeau affiche les 10 premières cryptos par capitalisation, d’après le classement de CoinGecko, hors stablecoins
            (USDT, USDC…) et jetons qui dupliquent un autre actif (WBTC, stETH…). Leurs cours sont en temps réel, à partir des flux
            publics de Binance, convertis en euros avec le cours EUR/USDT. La variation indiquée porte sur les dernières 24 heures.
          </p>
          <p>
            Les indices (CAC 40, S&amp;P 500, Nasdaq) et l’or sont affichés en différé d’au moins 15 minutes, avec l’heure du cours.
            Diffuser ces cours en temps réel nécessite des licences payantes auprès des bourses. Données Euronext pour le CAC 40.
          </p>
        </section>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const rows = await getMarketsRows()
  return { props: { rows }, revalidate: rows.every((r) => r.stats) ? REVALIDATE : 300 }
}
