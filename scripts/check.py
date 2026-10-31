"""Check generated HTML links, images, app manifest, and downloadable folder."""
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import unquote, urlsplit
import zipfile

ROOT = Path(__file__).resolve().parents[1] / 'public'
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links = [], []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.links.append(attrs[key])

for filename in ('index.html', 'app.html'):
    page = Page()
    page.feed((ROOT / filename).read_text(encoding='utf-8'))
    assert len(page.ids) == len(set(page.ids)), filename + ': duplicate IDs'
    for link in page.links:
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc:
            continue
        if parsed.path:
            target = ROOT / unquote(parsed.path)
            assert target.is_file(), filename + ': missing ' + link
        elif parsed.fragment:
            assert parsed.fragment in page.ids, filename + ': missing anchor ' + link
manifest = json.loads((ROOT / 'manifest.webmanifest').read_text())
assert manifest['start_url'] == './app.html'
for icon in manifest['icons']:
    assert (ROOT / icon['src']).is_file()
for robot in ('brush', 'desk', 'rover', 'line', 'artist'):
    assert (ROOT / 'images' / (robot + '.svg')).is_file()
with zipfile.ZipFile(ROOT / 'robotlab-website.zip') as archive:
    assert archive.testzip() is None
    assert 'RobotLab/images/README.md' in archive.namelist()
assert not list(ROOT.rglob('.git'))
print('Passed: page links, robot pictures, app manifest, portable ZIP.')
