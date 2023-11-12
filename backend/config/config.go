package config

import "github.com/caarlos0/env/v10"

type Config struct {
	DBUser     string `env:"MYSQL_USER" envDefault:"db"`
	DBPassword string `env:"MYSQL_PASSWORD" envDefault:"db"`
	DBName     string `env:"MYSQL_DATABASE" envDefault:"db"`
	DBHost     string `env:"MYSQL_HOST" envDefault:"db"`
	DBPort     int    `env:"MYSQL_PORT" envDefault:"3306"`
}

func LoadConfig() (*Config, error) {
	cfg := Config{}
	if err := env.Parse(&cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}
