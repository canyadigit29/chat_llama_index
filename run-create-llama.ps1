Write-Host "`nAdding sources from create-llama..."

# Remove current create-llama folder
if (Test-Path "app\api\chat\config\") { Remove-Item -Force -Recurse "app\api\chat\config\" }
if (Test-Path "app\api\files") { Remove-Item -Force -Recurse "app\api\files" }
if (Test-Path "cl") { Remove-Item -Force -Recurse "cl" }

# Run the node command with specified options
npx -y create-llama@0.1.39 `
    --framework nextjs `
    --template streaming `
    --engine context `
    --frontend `
    --ui shadcn `
    --observability none `
    --open-ai-key "Set your OpenAI key here" `
    --llama-cloud-key "Set your LlamaCloud API key here" `
    --tools none `
    --post-install-action none `
    --no-llama-parse `
    --example-file `
    --vector-db llamacloud `
    --use-pnpm `
    -- cl

# copy routes from create-llama to app
# Note: if changes on these routes are needed, copy them to the project's app folder
if (!(Test-Path "app\api\chat\config")) {
    New-Item -ItemType Directory -Force -Path "app\api\chat\config"
}
Copy-Item -Force -Recurse "cl\app\api\chat\config\*" -Destination "app\api\chat\config\"

# copy example .env file
Copy-Item -Force "cl\.env" -Destination ".env.development.local"
