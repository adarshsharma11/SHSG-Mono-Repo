from shsg_api.core.settings import Settings


def test_comma_separated_origins_become_a_list() -> None:
    settings = Settings.model_validate(
        {"cors_origins": "http://localhost:9001, http://localhost:9002"}
    )

    assert settings.cors_origins == [
        "http://localhost:9001",
        "http://localhost:9002",
    ]


def test_defaults_allow_both_next_apps() -> None:
    settings = Settings()

    assert settings.cors_origins == [
        "http://localhost:9001",
        "http://localhost:9002",
    ]
    assert settings.environment == "local"
