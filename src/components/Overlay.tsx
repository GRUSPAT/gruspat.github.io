import '../styles/overlay.css'

export const Overlay = () => {
    return(
        <>
        <nav className="overlay">
            <p>PATRYK 
                <a className="portfolio"href="">PORTFOLIO&nbsp;</a>
                <a className="about" href="">ABOUT</a>
                <br></br>GRUSZOWSKI
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a className="contact" href="">CONTACT</a>
            </p>
        </nav>
        <div className="marquee-container">
        <div className="marquee">
            <span>*This site is currently under development and its core feature aren't available yet. Please consider visiting this site in future.*</span>
        </div>
    </div>
        </>
    )
}