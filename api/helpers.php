<?php

function is_valid_cpf(string $value): bool
{
    $value = preg_replace('/\D/', '', $value);

    if (strlen($value) !== 11) {
        return false;
    }

    for ($i = 0, $sum = 0; $i < 9; $i++) {
        $sum += (int) $value[$i] * (10 - $i);
    }

    if ($sum % 11 >= 2 && (11 - ($sum % 11)) != $value[9]) {
        return false;
    }

    for ($i = 0, $sum = 0; $i < 10; $i++) {
        $sum += (int) $value[$i] * (11 - $i);
    }

    if ($sum % 11 >= 2 && (11 - ($sum % 11)) != $value[10]) {
        return false;
    }

    return true;
}

function format_cpf(string $value): string
{
    return preg_replace(
        '/(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})/',
        '$1.$2.$3-$4',
        $value
    );
}
