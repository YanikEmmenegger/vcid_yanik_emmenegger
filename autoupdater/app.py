from flask import Flask
import os

app = Flask(__name__)


@app.route('/')
def run_script():
    os.system("cd ../")
    os.system("ls")
    os.system("./boot.sh")
    return "update initiated! - site will be down for a few seconds."


if __name__ == '__main__':
    app.run(debug=True)
