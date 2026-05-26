import { EXTENSION_NAME } from "../utils/constants";
import manifest from "../manifest.json";


export default function Footer() {
    const version = manifest.version;

    return (
        <div className="footer">
            <p>
                {EXTENSION_NAME + " v" + version}
            </p>

            <div className="footer-actions">
                <div className="footer-link">Docs</div>
                <div className="footer-link">GitHub</div>
            </div>
        </div>
    );
}
