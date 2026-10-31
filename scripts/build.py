"""Build a portable RobotLab website and generate a QR for its actual URL."""
import argparse
import hashlib
import os
from pathlib import Path
import re
import shutil
from urllib.parse import urlsplit
import zipfile

ROOT = Path(__file__).resolve().parents[1]

def build(site_url):
    site_url = site_url.rstrip('/')
    parsed = urlsplit(site_url)
    if parsed.scheme not in ('https', 'http') or not parsed.netloc or parsed.query or parsed.fragment:
        raise ValueError('Use a full website base URL without a query or fragment.')
    # Fail before replacing generated output if dependencies are unavailable.
    import qrcode
    from qrcode.image.pure import PyPNGImage
    output = ROOT / 'public'
    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(ROOT / 'site', output)
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=12, border=4)
    qr.add_data(site_url + '/')
    qr.make(fit=True)
    qr.make_image(image_factory=PyPNGImage).save(str(output / 'robotlab-qr.png'))
    # Change the worker cache when source or deployment URL changes.
    digest = hashlib.sha256(site_url.encode())
    for file in sorted(output.rglob('*')):
        if file.is_file():
            digest.update(file.relative_to(output).as_posix().encode())
            digest.update(file.read_bytes())
    worker = output / 'sw.js'
    worker.write_text(re.sub(r"const CACHE = '[^']+';",
                            "const CACHE = 'robotlab-studio-" + digest.hexdigest()[:12] + "';",
                            worker.read_text(encoding='utf-8')), encoding='utf-8')
    (output / '.nojekyll').write_text('')
    archive = output / 'robotlab-website.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as package:
        for file in sorted(output.rglob('*')):
            if file.is_file() and file != archive:
                package.write(file, Path('RobotLab') / file.relative_to(output))
    print('Built public/ for ' + site_url + '/')
    return output

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site-url', default=os.environ.get('PAGES_URL', 'http://localhost:8000'))
    args = parser.parse_args()
    build(args.site_url)
