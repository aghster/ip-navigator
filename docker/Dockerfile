FROM alpine:3.8
RUN apk add --no-cache --update \
  bash \
  python2 \
  python2-dev \
  build-base \
  jpeg-dev \
  freetype-dev \
  lcms2-dev \
  tiff-dev \
  libffi-dev \
  openssl-dev \
  libxml2-dev \
  libxslt-dev \
  zlib-dev \
  pdftk \
  imagemagick && \
  python -m ensurepip && \
  rm -r /usr/lib/python*/ensurepip && \
  pip install --upgrade pip setuptools wheel && \
  rm -r /root/.cache && \
  pip install patzilla
ENTRYPOINT ["/usr/bin/pserve"]
CMD ["/patzilla.ini"]
EXPOSE 9999 6543
