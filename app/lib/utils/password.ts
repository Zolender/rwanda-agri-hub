// Pure password strength checker — no server or client directive
// Can be imported by both server actions and client components freely

export function checkPasswordStrength(password: string): {
    score: number;    // 0–4, how many rules are passing
    errors: string[]; // which rules are still failing
} {
    const errors: string[] = [];

    if (password.length < 8)             errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password))         errors.push("At least one uppercase letter");
    if (!/[0-9]/.test(password))         errors.push("At least one number");
    if (!/[^A-Za-z0-9]/.test(password))  errors.push("At least one special character (!@#$...)");

    return { score: 4 - errors.length, errors };
}