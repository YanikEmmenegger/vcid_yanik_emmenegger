from flask import Flask
import subprocess

app = Flask(__name__)


@app.route('/')
def run_script():
    script_path = "./boot.sh"
    subprocess.call(script_path, shell=True)
    return "Script ausgeführt!"


if __name__ == "__main__":
    app.run(debug=True)
