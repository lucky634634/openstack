import './CreateVMModal.css'

export default function CreateVMModal() {
    return <div className='vm-modal'>
        <form>
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required />
            </div>
            <div>
                <label for="image">Image:</label>
                <input type="text" id="image" name="image" required />
            </div>
        </form>
    </div>
}