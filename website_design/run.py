from config import app
from view.static_view import static_view_b

app.register_blueprint(static_view_b, url_prefix='/')

if __name__ == '__main__':
    # app.run(host='192.168.1.5', port=5000)
    app.run(debug=True)
