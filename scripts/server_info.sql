SELECT inet_server_addr() AS server_addr,
    inet_server_port() AS server_port,
    version() AS pg_version;