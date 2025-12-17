import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import "./App.css";
import logo from "../public/assets/logo.png";
import { Player } from '@lottiefiles/react-lottie-player'
import SandyLoading from "../public/assets/SandyLoading.json";

function App() {
  const [coinData, setCoinData] = useState([]);
  console.log("coinData", coinData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [selectLimit, setSelectLimit] = useState<any>(15);

  useEffect(() => {
    async function initialApiFetch() {

      try {
        const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=";
        const apiRes = await fetch(apiUrl);
        if (!apiRes.ok) {
          throw new Error("Failed to fetch coin data");
        }
        const resData = await apiRes.json();
        setCoinData(resData);
      }
      catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      }
      finally {
        // keep small delay for animation smoothness
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }


    }
    initialApiFetch();
  }, []);

  const searchTimeoutId = useRef<null | number>(null);
  const handleSearchText = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (searchTimeoutId.current) {
      clearTimeout(searchTimeoutId.current);
    }
    searchTimeoutId.current = setTimeout(() => {
      console.log("value", value);
    }, 500);
  };
  const handleSelectLimit = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("e", e.currentTarget.value);
    setSelectLimit(e.currentTarget.value);
  }

  return (
    <main className="wrapper">
      <header className="header">
        <div className="logo_wrap">
          <img src={logo} alt="" />
        </div>
        <h1 className="header_tx">Crypto Dashboard</h1>
      </header>

      <div className="content">
        <section className="nav_section">
          <div className="search_section">
            <label htmlFor="search_input">Search :</label>
            <input
              type="text"
              id="search_input"
              placeholder="Filter by name or symbol..."
              onKeyUp={handleSearchText}
            />
          </div>
          <div className="limitSele_sort">
            <div className="limit_selector">
              <label htmlFor="limit_sel">Show : </label>
              <select id="limit_sel" name="limit_selctor" value={selectLimit} onChange={handleSelectLimit}>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="sort_wrap">
              <label htmlFor="sort_by">Sort By : </label>
              <select id="sort_by">
                <option>Market Cap (High to Low)</option>
                <option>Market Cap (Low to High)</option>
                <option>Price (High to Low)</option>
                <option>Price (Low to High)</option>
                <option>Percentage Change (High to Low) </option>
                <option>Percentage Change (Low to High) </option>
              </select>
            </div>
          </div>
        </section>
        <h2 className="crypto_cards_tit">Crypto Cards</h2>
        {
          loading ? <>

            <Player
              autoplay
              loop
              src={SandyLoading}
              style={{ height: '300px', width: '300px' }}
            />

          </> : error ? <div className="error_box">{error}</div> : <>

            {coinData.length > 1 ? (
              <section className="coin_cards">
                {coinData?.slice(0, selectLimit).map((ele: any) => (

                  <div className="coin_card" key={ele.id}>
                    <div className="coinIm_tit">
                      <div className="crypt_img_wrap">
                        <img src={ele.image} alt="" />
                      </div>
                      <div className="tit_w_symbol">
                        <h6 className="coin_name">{ele.name}</h6>
                        <p className="coin_symbol">{ele.symbol}</p>
                      </div>
                    </div>
                    <div className="coin_descs">
                      <p className="coin_desc">Price: ${ele.current_price.toLocaleString()}</p>
                      <p className="coin_desc">
                        24 Hour Change:{" "}
                        {ele.ath_change_percentage < 0 ? (
                          <span className="percentage_dec">
                            {ele.ath_change_percentage}
                          </span>
                        ) : (
                          <span className="percentage_inc">
                            {ele.ath_change_percentage}
                          </span>
                        )}
                      </p>
                      <p className="coin_desc">Market Cap : {(ele.market_cap).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <section className="no_data_fnd">No Data Found</section>
            )}
          </>
        }


      </div>
    </main>
  );
}

export default App;
