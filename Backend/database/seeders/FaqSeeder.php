<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Is my code sent to external servers?',
                'answer' => 'Cursorline processes your codebase locally by default. When cloud features are enabled, only encrypted diffs and metadata leave your machine \u2014 never full source files. We are SOC 2 Type II compliant and never train on your code.',
                'sort_order' => 0,
                'is_active' => true,
            ],
            [
                'question' => 'Which editors and IDEs are supported?',
                'answer' => 'Cursorline ships first-party extensions for VS Code, Neovim, and JetBrains IDEs (IntelliJ, PyCharm, WebStorm, and more). A generic LSP adapter is also available for other editors.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'question' => 'Does it work with large or legacy codebases?',
                'answer' => 'Yes. Cursorline uses incremental indexing so repos with millions of lines are handled efficiently. It respects .gitignore and .cursorlineignore to skip generated files, and it supports monorepo setups out of the box.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'question' => 'What does the free plan include?',
                'answer' => 'The free plan gives you 50 completions per day, single-repo indexing, stack trace analysis, and access to the VS Code extension \u2014 no credit card required. Upgrade to Pro for unlimited usage and advanced features.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'question' => 'Can I cancel my subscription anytime?',
                'answer' => 'Absolutely. You can cancel your Pro or Team plan from your dashboard at any time. Your access continues until the end of the current billing period \u2014 no prorated charges, no cancellation fees.',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::firstOrCreate(
                ['question' => $faq['question']],
                $faq,
            );
        }
    }
}
